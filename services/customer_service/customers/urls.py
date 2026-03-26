from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .auth import login, me
from .views import CustomerViewSet, health

router = DefaultRouter()
router.register(r"customers", CustomerViewSet, basename="customer")

urlpatterns = [
    path("api/auth/login/", login),
    path("api/auth/me/", me),
    path("api/", include(router.urls)),
    path("api/health/", health),
]
