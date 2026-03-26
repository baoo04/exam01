from django.db import models


class GatewayRoute(models.Model):
    """Registry nội bộ: ánh xạ prefix → upstream (mock; phục vụ catalog & admin)."""

    prefix = models.CharField(max_length=128, unique=True)
    upstream_service = models.CharField(max_length=128)
    upstream_port = models.PositiveIntegerField()
    description = models.CharField(max_length=255, blank=True)
    enabled = models.BooleanField(default=True)

    class Meta:
        ordering = ["prefix"]
        verbose_name = "Gateway route"
        verbose_name_plural = "Gateway routes"

    def __str__(self):
        return f"{self.prefix} → {self.upstream_service}:{self.upstream_port}"
