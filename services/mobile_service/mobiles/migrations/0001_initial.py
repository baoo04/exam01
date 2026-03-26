import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Mobile",
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
                ("os", models.CharField(max_length=20)),
                ("cpu_chip", models.CharField(max_length=100)),
                ("ram", models.IntegerField()),
                ("storage", models.IntegerField()),
                ("battery", models.IntegerField()),
                ("screen_size", models.FloatField()),
                ("camera_main", models.IntegerField()),
                ("camera_front", models.IntegerField()),
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
