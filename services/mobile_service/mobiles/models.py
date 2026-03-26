import uuid

from django.db import models


class Mobile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=100)
    os = models.CharField(max_length=20)
    cpu_chip = models.CharField(max_length=100)
    ram = models.IntegerField()
    storage = models.IntegerField()
    battery = models.IntegerField()
    screen_size = models.FloatField()
    camera_main = models.IntegerField()
    camera_front = models.IntegerField()
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
