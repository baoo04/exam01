import uuid

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Order",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("customer_id", models.UUIDField()),
                (
                    "total_amount",
                    models.DecimalField(decimal_places=2, max_digits=14),
                ),
                ("status", models.CharField(max_length=20)),
                ("payment_method", models.CharField(max_length=20)),
                ("payment_status", models.CharField(max_length=20)),
                ("shipping_address", models.TextField()),
                ("note", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("product_id", models.UUIDField()),
                ("product_type", models.CharField(max_length=10)),
                ("product_name", models.CharField(max_length=255)),
                ("quantity", models.IntegerField()),
                (
                    "unit_price",
                    models.DecimalField(decimal_places=2, max_digits=12),
                ),
                (
                    "subtotal",
                    models.DecimalField(decimal_places=2, max_digits=14),
                ),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="items",
                        to="orders.order",
                    ),
                ),
            ],
            options={
                "ordering": ["id"],
            },
        ),
    ]
