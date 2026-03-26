import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Laptop",
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
                ("name", models.CharField(max_length=255)),
                ("brand", models.CharField(max_length=100)),
                ("cpu", models.CharField(max_length=100)),
                ("ram", models.IntegerField()),
                ("storage", models.IntegerField()),
                ("storage_type", models.CharField(max_length=10)),
                ("gpu", models.CharField(blank=True, max_length=100, null=True)),
                ("screen_size", models.FloatField()),
                ("price", models.DecimalField(decimal_places=2, max_digits=12)),
                ("stock", models.IntegerField(default=0)),
                ("image_url", models.URLField(blank=True, null=True)),
                ("description", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["name"],
            },
        ),
    ]
