# Generated manually for api-gateway

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="GatewayRoute",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("prefix", models.CharField(max_length=128, unique=True)),
                ("upstream_service", models.CharField(max_length=128)),
                ("upstream_port", models.PositiveIntegerField()),
                ("description", models.CharField(blank=True, max_length=255)),
                ("enabled", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "Gateway route",
                "verbose_name_plural": "Gateway routes",
                "ordering": ["prefix"],
            },
        ),
    ]
