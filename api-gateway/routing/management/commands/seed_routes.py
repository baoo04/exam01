from django.core.management.base import BaseCommand

from routing.models import GatewayRoute
from routing.services.upstream_registry import ROUTING_MATRIX


class Command(BaseCommand):
    help = "Đồng bộ bảng GatewayRoute từ ROUTING_MATRIX (mock registry)."

    def handle(self, *args, **options):
        for row in ROUTING_MATRIX:
            prefix = row["path_prefix"]
            GatewayRoute.objects.update_or_create(
                prefix=prefix,
                defaults={
                    "upstream_service": row["upstream"],
                    "upstream_port": row["port"],
                    "description": row.get("db", ""),
                    "enabled": True,
                },
            )
        n = GatewayRoute.objects.count()
        self.stdout.write(self.style.SUCCESS(f"Đã seed {n} route."))
