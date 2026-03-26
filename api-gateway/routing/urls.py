from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import GatewayRouteViewSet, health, routing_matrix

router = DefaultRouter()
router.register("gateway/catalog", GatewayRouteViewSet, basename="gateway-catalog")

urlpatterns = [
    path("health/", health),
    path("gateway/matrix/", routing_matrix),
    *router.urls,
]
