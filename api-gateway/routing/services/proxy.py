from __future__ import annotations

from dataclasses import dataclass

from routing.models import GatewayRoute
from routing.services.upstream_registry import ROUTING_MATRIX


@dataclass(frozen=True)
class UpstreamTarget:
    service: str
    port: int
    path: str

    @property
    def base_url(self) -> str:
        return f"http://{self.service}:{self.port}"

    @property
    def url(self) -> str:
        return f"{self.base_url}{self.path}"


def _resolve_auth_alias(request_path: str) -> UpstreamTarget | None:
    # Disambiguate two auth services by dedicated gateway aliases.
    if request_path.startswith("/api/auth/customer/"):
        suffix = request_path.removeprefix("/api/auth/customer")
        return UpstreamTarget(
            service="customer_service",
            port=8003,
            path=f"/api/auth{suffix}",
        )
    if request_path.startswith("/api/auth/staff/"):
        suffix = request_path.removeprefix("/api/auth/staff")
        return UpstreamTarget(
            service="staff_service",
            port=8004,
            path=f"/api/auth{suffix}",
        )
    return None


def _resolve_from_seeded_routes(request_path: str) -> UpstreamTarget | None:
    routes = list(
        GatewayRoute.objects.filter(enabled=True)
        .only("prefix", "upstream_service", "upstream_port")
    )
    routes.sort(key=lambda row: len(row.prefix), reverse=True)
    for route in routes:
        if request_path.startswith(route.prefix):
            return UpstreamTarget(
                service=route.upstream_service,
                port=route.upstream_port,
                path=request_path,
            )
    return None


def _resolve_from_static_matrix(request_path: str) -> UpstreamTarget | None:
    matched = None
    for row in ROUTING_MATRIX:
        prefix = row["path_prefix"]
        if request_path.startswith(prefix):
            if matched is None or len(prefix) > len(matched["path_prefix"]):
                matched = row
    if not matched:
        return None
    return UpstreamTarget(
        service=matched["upstream"],
        port=matched["port"],
        path=request_path,
    )


def resolve_upstream(request_path: str) -> UpstreamTarget | None:
    auth_alias = _resolve_auth_alias(request_path)
    if auth_alias:
        return auth_alias

    route = _resolve_from_seeded_routes(request_path)
    if route:
        return route

    return _resolve_from_static_matrix(request_path)
