from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mobiles", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="mobile",
            name="image_url",
            field=models.URLField(blank=True, max_length=2000, null=True),
        ),
    ]
