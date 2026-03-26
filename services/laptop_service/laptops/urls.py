from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import LaptopViewSet, health

router = DefaultRouter()
router.register(r"laptops", LaptopViewSet, basename="laptop")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/health/", health),
]
