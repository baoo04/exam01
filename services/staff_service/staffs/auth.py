from django.contrib.auth.hashers import check_password
from django.core import signing
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Staff
from .serializers import StaffSerializer

TOKEN_MAX_AGE = 60 * 60 * 24 * 7


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = (request.data.get("email") or "").strip()
    password = request.data.get("password") or ""
    if not email or not password:
        return Response(
            {"detail": "Vui lòng nhập email và mật khẩu."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        staff = Staff.objects.get(email__iexact=email, is_active=True)
    except Staff.DoesNotExist:
        return Response(
            {"detail": "Sai email hoặc mật khẩu."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if not staff.password or not check_password(password, staff.password):
        return Response(
            {"detail": "Sai email hoặc mật khẩu."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    token = signing.dumps({"uid": str(staff.id), "role": "staff"})
    return Response(
        {"token": token, "staff": StaffSerializer(staff).data},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def me(request):
    auth = request.headers.get("Authorization") or ""
    if not auth.startswith("Bearer "):
        return Response({"detail": "Thiếu token."}, status=status.HTTP_401_UNAUTHORIZED)
    token = auth[7:].strip()
    try:
        payload = signing.loads(token, max_age=TOKEN_MAX_AGE)
    except signing.BadSignature:
        return Response({"detail": "Token không hợp lệ."}, status=status.HTTP_401_UNAUTHORIZED)
    if payload.get("role") != "staff":
        return Response({"detail": "Token sai loại tài khoản."}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        staff = Staff.objects.get(pk=payload["uid"], is_active=True)
    except Staff.DoesNotExist:
        return Response({"detail": "Không tìm thấy nhân viên."}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(StaffSerializer(staff).data)
