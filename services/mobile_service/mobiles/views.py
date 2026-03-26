import os

from django.db.models import Q
from django.http import JsonResponse
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Mobile
from .serializers import MobileSerializer


def health(request):
    return JsonResponse(
        {
            "status": "ok",
            "service": os.getenv("SERVICE_NAME", "mobile_service"),
        }
    )


class MobileViewSet(viewsets.ModelViewSet):
    queryset = Mobile.objects.all()
    serializer_class = MobileSerializer

    @action(detail=True, methods=["post"], url_path="receive-stock")
    def receive_stock(self, request, pk=None):
        mobile = self.get_object()
        try:
            delta = int(request.data.get("delta", 0))
        except (TypeError, ValueError):
            return Response(
                {"detail": "delta phải là số nguyên."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if delta == 0:
            return Response(
                {"detail": "delta không được bằng 0."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        mobile.stock = max(0, mobile.stock + delta)
        mobile.save(update_fields=["stock", "updated_at"])
        return Response(MobileSerializer(mobile).data)

    @action(detail=False, methods=["get"], url_path="search")
    def search(self, request):
        q = request.query_params.get("q", "").strip()
        qs = self.queryset
        if q:
            qs = qs.filter(
                Q(name__icontains=q)
                | Q(brand__icontains=q)
                | Q(os__icontains=q)
                | Q(cpu_chip__icontains=q)
                | Q(description__icontains=q)
            )
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
