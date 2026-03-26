from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import OrderViewSet, health

router = DefaultRouter()
router.register(r"orders", OrderViewSet, basename="order")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/health/", health),
]
