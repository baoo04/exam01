from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MobileViewSet, health

router = DefaultRouter()
router.register(r"mobiles", MobileViewSet, basename="mobile")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/health/", health),
]
