import uuid

from django.db import models


class Staff(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, default="")
    phone = models.CharField(max_length=15)
    role = models.CharField(max_length=50)
    department = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=12, decimal_places=2)
    hire_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["full_name"]
        verbose_name_plural = "staff"

    def __str__(self):
        return self.full_name
