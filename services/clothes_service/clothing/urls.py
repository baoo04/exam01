from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ClothingViewSet, health

router = DefaultRouter()
router.register(r"clothes", ClothingViewSet, basename="clothing")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/health/", health),
]
