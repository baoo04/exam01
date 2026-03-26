from django.contrib import admin

from .models import GatewayRoute


@admin.register(GatewayRoute)
class GatewayRouteAdmin(admin.ModelAdmin):
    list_display = ("prefix", "upstream_service", "upstream_port", "enabled", "description")
    list_filter = ("enabled",)
    search_fields = ("prefix", "upstream_service", "description")
