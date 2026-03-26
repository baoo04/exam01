from django.contrib.auth.hashers import make_password
from django.db import migrations, models


def hash_default_passwords(apps, schema_editor):
    Customer = apps.get_model("customers", "Customer")
    for row in Customer.objects.all():
        row.password = make_password("Khach@123")
        row.save(update_fields=["password"])


class Migration(migrations.Migration):

    dependencies = [
        ("customers", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="customer",
            name="password",
            field=models.CharField(default="", max_length=128),
        ),
        migrations.RunPython(hash_default_passwords, migrations.RunPython.noop),
    ]
