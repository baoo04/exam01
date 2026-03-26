from django.contrib.auth.hashers import make_password
from django.db import migrations, models


def hash_default_passwords(apps, schema_editor):
    Staff = apps.get_model("staffs", "Staff")
    for row in Staff.objects.all():
        row.password = make_password("Staff@123")
        row.save(update_fields=["password"])


class Migration(migrations.Migration):

    dependencies = [
        ("staffs", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="staff",
            name="password",
            field=models.CharField(default="", max_length=128),
        ),
        migrations.RunPython(hash_default_passwords, migrations.RunPython.noop),
    ]
