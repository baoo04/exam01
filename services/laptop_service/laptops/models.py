import uuid

from django.db import models


class Laptop(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=100)
    cpu = models.CharField(max_length=100)
    ram = models.IntegerField()
    storage = models.IntegerField()
    storage_type = models.CharField(max_length=10)
    gpu = models.CharField(max_length=100, null=True, blank=True)
    screen_size = models.FloatField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    stock = models.IntegerField(default=0)
    image_url = models.URLField(max_length=2000, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
