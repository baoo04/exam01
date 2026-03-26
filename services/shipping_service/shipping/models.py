import uuid

from django.db import models


class Shipping(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_id = models.UUIDField()
    tracking_code = models.CharField(max_length=50, unique=True)
    carrier = models.CharField(max_length=50)
    status = models.CharField(max_length=20)
    estimated_date = models.DateField()
    actual_date = models.DateField(null=True, blank=True)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2)
    from_address = models.TextField()
    to_address = models.TextField()
    note = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "shipping records"

    def __str__(self):
        return self.tracking_code
