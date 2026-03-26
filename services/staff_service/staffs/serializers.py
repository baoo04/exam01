from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import Staff


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        exclude = ("password",)


class StaffWriteSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=False, allow_blank=True, style={"input_type": "password"}
    )

    class Meta:
        model = Staff
        fields = [
            "id",
            "full_name",
            "email",
            "password",
            "phone",
            "role",
            "department",
            "salary",
            "hire_date",
            "is_active",
        ]
        read_only_fields = ["id"]

    def create(self, validated_data):
        raw = validated_data.pop("password", None) or ""
        validated_data["password"] = (
            make_password(raw) if raw else make_password("changeme")
        )
        return Staff.objects.create(**validated_data)

    def update(self, instance, validated_data):
        raw = validated_data.pop("password", None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        if raw:
            instance.password = make_password(raw)
        instance.save()
        return instance
