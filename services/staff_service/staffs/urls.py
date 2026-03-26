from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .auth import login, me
from .views import StaffViewSet, health

router = DefaultRouter()
router.register(r"staff", StaffViewSet, basename="staff")

urlpatterns = [
    path("api/auth/login/", login),
    path("api/auth/me/", me),
    path("api/", include(router.urls)),
    path("api/health/", health),
]
