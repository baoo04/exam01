from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("laptops", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="laptop",
            name="image_url",
            field=models.URLField(blank=True, max_length=2000, null=True),
        ),
    ]
