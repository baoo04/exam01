from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("customers", "0002_customer_password"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customer",
            name="avatar_url",
            field=models.URLField(blank=True, max_length=2000, null=True),
        ),
    ]
