import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Shipping",
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
                ("order_id", models.UUIDField()),
                ("tracking_code", models.CharField(max_length=50, unique=True)),
                ("carrier", models.CharField(max_length=50)),
                ("status", models.CharField(max_length=20)),
                ("estimated_date", models.DateField()),
                ("actual_date", models.DateField(blank=True, null=True)),
                (
                    "shipping_fee",
                    models.DecimalField(decimal_places=2, max_digits=10),
                ),
                ("from_address", models.TextField()),
                ("to_address", models.TextField()),
                ("note", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["-created_at"],
                "verbose_name_plural": "shipping records",
            },
        ),
    ]
