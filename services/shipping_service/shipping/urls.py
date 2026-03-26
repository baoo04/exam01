from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ShippingViewSet, health

router = DefaultRouter()
router.register(r"shipping", ShippingViewSet, basename="shipping")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/health/", health),
]
