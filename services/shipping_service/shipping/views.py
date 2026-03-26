import os

from django.db.models import Q
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Shipping
from .serializers import ShippingSerializer


def health(request):
    return JsonResponse(
        {
            "status": "ok",
            "service": os.getenv("SERVICE_NAME", "shipping_service"),
        }
    )


class ShippingViewSet(viewsets.ModelViewSet):
    queryset = Shipping.objects.all()
    serializer_class = ShippingSerializer

    @action(detail=False, methods=["get"], url_path="search")
    def search(self, request):
        q = request.query_params.get("q", "").strip()
        qs = self.queryset
        if q:
            qs = qs.filter(
                Q(tracking_code__icontains=q)
                | Q(carrier__icontains=q)
                | Q(status__icontains=q)
                | Q(to_address__icontains=q)
                | Q(from_address__icontains=q)
            )
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
