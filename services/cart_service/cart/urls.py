from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CartViewSet, health

router = DefaultRouter()
router.register(r"cart", CartViewSet, basename="cart")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/health/", health),
]
