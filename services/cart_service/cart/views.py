import os

from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Cart
from .serializers import CartSerializer, CartWriteSerializer


def health(request):
    return JsonResponse(
        {
            "status": "ok",
            "service": os.getenv("SERVICE_NAME", "cart_service"),
        }
    )


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all().prefetch_related("items")
    serializer_class = CartSerializer

    def get_queryset(self):
        qs = super().get_queryset().order_by("-updated_at")
        cid = self.request.query_params.get("customer_id")
        if cid:
            qs = qs.filter(customer_id=cid)
        return qs

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return CartWriteSerializer
        return CartSerializer

    @action(detail=False, methods=["get"], url_path="search")
    def search(self, request):
        q = request.query_params.get("q", "").strip()
        qs = self.queryset
        if q:
            qs = qs.filter(items__product_name__icontains=q).distinct()
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = CartSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = CartSerializer(qs, many=True)
        return Response(serializer.data)
