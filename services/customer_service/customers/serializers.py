from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        exclude = ("password",)


class CustomerWriteSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        min_length=6,
        style={"input_type": "password"},
    )

    class Meta:
        model = Customer
        fields = [
            "id",
            "full_name",
            "email",
            "password",
            "phone",
            "address",
            "city",
            "date_of_birth",
            "gender",
            "avatar_url",
            "is_active",
        ]
        read_only_fields = ["id"]

    def create(self, validated_data):
        raw = validated_data.pop("password", None)
        if not raw:
            raise serializers.ValidationError(
                {"password": "Vui lòng nhập mật khẩu (tối thiểu 6 ký tự)."}
            )
        validated_data["password"] = make_password(raw)
        return Customer.objects.create(**validated_data)

    def update(self, instance, validated_data):
        raw = validated_data.pop("password", None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        if raw:
            instance.password = make_password(raw)
        instance.save()
        return instance
