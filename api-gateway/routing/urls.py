from django.urls import path, re_path
from rest_framework.routers import DefaultRouter

from .views import GatewayRouteViewSet, health, proxy_request, routing_matrix

router = DefaultRouter()
router.register("gateway/catalog", GatewayRouteViewSet, basename="gateway-catalog")

urlpatterns = [
    path("health/", health),
    path("gateway/matrix/", routing_matrix),
    *router.urls,
    re_path(r"^(?P<proxy_path>.*)$", proxy_request),
]
