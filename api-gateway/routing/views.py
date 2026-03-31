import logging
import time

import requests
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets

from .models import GatewayRoute
from .serializers import GatewayRouteSerializer
from .services.proxy import resolve_upstream
from .services.upstream_registry import ROUTING_MATRIX

logger = logging.getLogger("gateway.proxy")

FORWARDED_REQUEST_HEADERS = (
    "authorization",
    "content-type",
    "accept",
    "user-agent",
    "x-request-id",
)

FORWARDED_RESPONSE_HEADERS = (
    "content-type",
    "cache-control",
    "etag",
    "last-modified",
)


def root_welcome(request):
    return JsonResponse(
        {
            "service": "api_gateway",
            "framework": "Django + DRF",
            "role": "edge-routing (proxy + registry + health)",
            "endpoints": {
                "health": "/api/health/",
                "catalog": "/api/gateway/catalog/",
                "matrix": "/api/gateway/matrix/",
                "customer_auth_login": "/api/auth/customer/login/",
                "staff_auth_login": "/api/auth/staff/login/",
                "admin": "/admin/",
            },
        }
    )


def health(request):
    return JsonResponse(
        {
            "service": "api_gateway",
            "status": "ok",
            "detail": "Gateway microservice — proxy API requests to upstream services.",
        }
    )


def routing_matrix(request):
    """Static route matrix to inspect upstream mapping."""
    return JsonResponse({"routes": ROUTING_MATRIX})


def _collect_forward_headers(request):
    headers = {}
    for header_name in FORWARDED_REQUEST_HEADERS:
        meta_key = f"HTTP_{header_name.upper().replace('-', '_')}"
        if header_name == "content-type":
            value = request.META.get("CONTENT_TYPE")
        else:
            value = request.META.get(meta_key)
        if value:
            headers[header_name] = value
    headers["x-forwarded-for"] = request.META.get(
        "HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", "")
    )
    headers["x-forwarded-proto"] = request.scheme
    headers["x-forwarded-host"] = request.get_host()
    return headers


def proxy_request(request, proxy_path=""):
    del proxy_path  # Explicitly unused: request.path is the source of truth.
    upstream = resolve_upstream(request.path)
    if not upstream:
        return JsonResponse(
            {
                "detail": "No upstream route matched.",
                "path": request.path,
            },
            status=404,
        )

    timeout_seconds = getattr(settings, "UPSTREAM_TIMEOUT_SECONDS", 8.0)
    query_string = request.META.get("QUERY_STRING", "")
    upstream_url = upstream.url
    if query_string:
        upstream_url = f"{upstream_url}?{query_string}"

    started_at = time.perf_counter()
    try:
        upstream_resp = requests.request(
            method=request.method,
            url=upstream_url,
            headers=_collect_forward_headers(request),
            data=request.body if request.method not in ("GET", "HEAD") else None,
            allow_redirects=False,
            timeout=timeout_seconds,
        )
    except requests.Timeout:
        duration_ms = int((time.perf_counter() - started_at) * 1000)
        logger.warning(
            "proxy timeout method=%s path=%s upstream=%s duration_ms=%s",
            request.method,
            request.path,
            upstream.base_url,
            duration_ms,
        )
        return JsonResponse(
            {
                "detail": "Upstream service timed out.",
                "upstream": upstream.base_url,
            },
            status=504,
        )
    except requests.RequestException as exc:
        duration_ms = int((time.perf_counter() - started_at) * 1000)
        logger.error(
            "proxy bad-gateway method=%s path=%s upstream=%s duration_ms=%s error=%s",
            request.method,
            request.path,
            upstream.base_url,
            duration_ms,
            exc.__class__.__name__,
        )
        return JsonResponse(
            {
                "detail": "Upstream service unavailable.",
                "upstream": upstream.base_url,
            },
            status=502,
        )

    duration_ms = int((time.perf_counter() - started_at) * 1000)
    logger.info(
        "proxy request method=%s path=%s upstream=%s status=%s duration_ms=%s",
        request.method,
        request.path,
        upstream.base_url,
        upstream_resp.status_code,
        duration_ms,
    )

    response = HttpResponse(
        upstream_resp.content,
        status=upstream_resp.status_code,
    )
    for header_name in FORWARDED_RESPONSE_HEADERS:
        header_value = upstream_resp.headers.get(header_name)
        if header_value:
            response[header_name] = header_value
    return response


class GatewayRouteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GatewayRoute.objects.filter(enabled=True)
    serializer_class = GatewayRouteSerializer
