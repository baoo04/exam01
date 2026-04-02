from django.http import JsonResponse
from rest_framework import viewsets

from .models import GatewayRoute
from .serializers import GatewayRouteSerializer
from .services.upstream_registry import ROUTING_MATRIX


def root_welcome(request):
    return JsonResponse(
        {
            "service": "api_gateway",
            "framework": "Django + DRF",
            "role": "edge-routing (mock registry + health)",
            "endpoints": {
                "health": "/api/health/",
                "catalog": "/api/gateway/catalog/",
                "matrix": "/api/gateway/matrix/",
                "admin": "/admin/",
            },
        }
    )


def health(request):
    return JsonResponse(
        {
            "service": "api_gateway",
            "status": "ok",
            "detail": "Gateway microservice — đăng ký route tập trung (mock).",
        }
    )


def routing_matrix(request):
    """Bảng ánh xạ tĩnh (file) — chụp màn hình cho báo cáo."""
    return JsonResponse({"routes": ROUTING_MATRIX})


class GatewayRouteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GatewayRoute.objects.filter(enabled=True)
    serializer_class = GatewayRouteSerializer
