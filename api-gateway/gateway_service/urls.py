from django.contrib import admin
from django.urls import include, path

from routing.views import root_welcome

urlpatterns = [
    path("", root_welcome),
    path("admin/", admin.site.urls),
    path("api/", include("routing.urls")),
]
