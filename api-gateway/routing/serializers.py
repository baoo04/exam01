from rest_framework import serializers

from .models import GatewayRoute


class GatewayRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = GatewayRoute
        fields = (
            "id",
            "prefix",
            "upstream_service",
            "upstream_port",
            "description",
            "enabled",
        )
