import uuid
from decimal import Decimal

from django.core.management.base import BaseCommand

from orders.models import Order, OrderItem

SEED_NS = uuid.UUID("00000000-0000-0000-0000-00000000e001")


def cid(i: int) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"customer:{i}")


def lid(key: str) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"laptop:{key}")


def mid(key: str) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"mobile:{key}")


def oid(i: int) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"order:{i}")


def item_pk(order_idx: int, seq: int) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"order:{order_idx}:item:{seq}")


class Command(BaseCommand):
    help = "Seed orders and order items"

    def handle(self, *args, **options):
        Order.objects.all().delete()

        bundles = [
            {
                "order_idx": 1,
                "customer": 1,
                "status": "pending",
                "payment_method": "COD",
                "payment_status": "unpaid",
                "shipping_address": "12 Nguyễn Trãi, Thanh Xuân, Hà Nội",
                "note": "Giao giờ hành chính.",
                "items": [
                    {
                        "seq": 1,
                        "product_id": lid("dell-xps-13"),
                        "product_type": "laptop",
                        "product_name": "Dell XPS 13",
                        "quantity": 1,
                        "unit_price": Decimal("28990000"),
                    },
                    {
                        "seq": 2,
                        "product_id": mid("iphone-15"),
                        "product_type": "mobile",
                        "product_name": "iPhone 15",
                        "quantity": 1,
                        "unit_price": Decimal("19990000"),
                    },
                ],
            },
            {
                "order_idx": 2,
                "customer": 2,
                "status": "confirmed",
                "payment_method": "banking",
                "payment_status": "paid",
                "shipping_address": "45 Lê Văn Sỹ, Quận 3, TP.HCM",
                "note": None,
                "items": [
                    {
                        "seq": 1,
                        "product_id": mid("s24-ultra"),
                        "product_type": "mobile",
                        "product_name": "Samsung Galaxy S24 Ultra",
                        "quantity": 1,
                        "unit_price": Decimal("31990000"),
                    },
                ],
            },
            {
                "order_idx": 3,
                "customer": 3,
                "status": "shipping",
                "payment_method": "momo",
                "payment_status": "paid",
                "shipping_address": "78 Trần Phú, Hải Châu, Đà Nẵng",
                "note": "Gọi trước khi giao.",
                "items": [
                    {
                        "seq": 1,
                        "product_id": lid("asus-rog-strix-g15"),
                        "product_type": "laptop",
                        "product_name": "Asus ROG Strix G15",
                        "quantity": 1,
                        "unit_price": Decimal("42990000"),
                    },
                    {
                        "seq": 2,
                        "product_id": mid("galaxy-a55"),
                        "product_type": "mobile",
                        "product_name": "Samsung Galaxy A55",
                        "quantity": 2,
                        "unit_price": Decimal("8990000"),
                    },
                ],
            },
            {
                "order_idx": 4,
                "customer": 4,
                "status": "delivered",
                "payment_method": "vnpay",
                "payment_status": "paid",
                "shipping_address": "90 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ",
                "note": "Đã nhận hàng tốt.",
                "items": [
                    {
                        "seq": 1,
                        "product_id": lid("hp-pavilion-15"),
                        "product_type": "laptop",
                        "product_name": "HP Pavilion 15",
                        "quantity": 1,
                        "unit_price": Decimal("19990000"),
                    },
                ],
            },
            {
                "order_idx": 5,
                "customer": 5,
                "status": "cancelled",
                "payment_method": "COD",
                "payment_status": "refunded",
                "shipping_address": "34 Lạch Tray, Ngô Quyền, Hải Phòng",
                "note": "Khách hủy — hết hàng.",
                "items": [
                    {
                        "seq": 1,
                        "product_id": mid("iphone-15-pro-max"),
                        "product_type": "mobile",
                        "product_name": "iPhone 15 Pro Max",
                        "quantity": 1,
                        "unit_price": Decimal("33990000"),
                    },
                    {
                        "seq": 2,
                        "product_id": mid("pixel-8"),
                        "product_type": "mobile",
                        "product_name": "Google Pixel 8",
                        "quantity": 1,
                        "unit_price": Decimal("17990000"),
                    },
                ],
            },
            {
                "order_idx": 6,
                "customer": 6,
                "status": "pending",
                "payment_method": "momo",
                "payment_status": "unpaid",
                "shipping_address": "56 Giảng Võ, Ba Đình, Hà Nội",
                "note": "",
                "items": [
                    {
                        "seq": 1,
                        "product_id": lid("acer-aspire-5"),
                        "product_type": "laptop",
                        "product_name": "Acer Aspire 5",
                        "quantity": 1,
                        "unit_price": Decimal("12990000"),
                    },
                    {
                        "seq": 2,
                        "product_id": lid("lenovo-ideapad-5"),
                        "product_type": "laptop",
                        "product_name": "Lenovo IdeaPad 5",
                        "quantity": 1,
                        "unit_price": Decimal("16990000"),
                    },
                    {
                        "seq": 3,
                        "product_id": mid("redmi-note-13-pro"),
                        "product_type": "mobile",
                        "product_name": "Xiaomi Redmi Note 13 Pro",
                        "quantity": 1,
                        "unit_price": Decimal("6990000"),
                    },
                ],
            },
            {
                "order_idx": 7,
                "customer": 7,
                "status": "confirmed",
                "payment_method": "banking",
                "payment_status": "paid",
                "shipping_address": "10 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
                "note": "Xuất VAT công ty.",
                "items": [
                    {
                        "seq": 1,
                        "product_id": lid("apple-macbook-pro-14-m3"),
                        "product_type": "laptop",
                        "product_name": "Apple MacBook Pro 14 M3",
                        "quantity": 1,
                        "unit_price": Decimal("57990000"),
                    },
                ],
            },
            {
                "order_idx": 8,
                "customer": 8,
                "status": "shipping",
                "payment_method": "COD",
                "payment_status": "unpaid",
                "shipping_address": "22 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
                "note": None,
                "items": [
                    {
                        "seq": 1,
                        "product_id": mid("xiaomi-14"),
                        "product_type": "mobile",
                        "product_name": "Xiaomi 14",
                        "quantity": 1,
                        "unit_price": Decimal("22990000"),
                    },
                    {
                        "seq": 2,
                        "product_id": mid("oppo-reno-11"),
                        "product_type": "mobile",
                        "product_name": "Oppo Reno 11",
                        "quantity": 1,
                        "unit_price": Decimal("10990000"),
                    },
                ],
            },
            {
                "order_idx": 9,
                "customer": 9,
                "status": "delivered",
                "payment_method": "vnpay",
                "payment_status": "paid",
                "shipping_address": "5 Phan Đình Phùng, Ninh Kiều, Cần Thơ",
                "note": "Khách VIP.",
                "items": [
                    {
                        "seq": 1,
                        "product_id": lid("lg-gram-16"),
                        "product_type": "laptop",
                        "product_name": "LG Gram 16",
                        "quantity": 1,
                        "unit_price": Decimal("34990000"),
                    },
                ],
            },
            {
                "order_idx": 10,
                "customer": 10,
                "status": "pending",
                "payment_method": "banking",
                "payment_status": "unpaid",
                "shipping_address": "18 Minh Khai, Hồng Bàng, Hải Phòng",
                "note": "Chờ chuyển khoản.",
                "items": [
                    {
                        "seq": 1,
                        "product_id": lid("msi-modern-14"),
                        "product_type": "laptop",
                        "product_name": "MSI Modern 14",
                        "quantity": 1,
                        "unit_price": Decimal("17990000"),
                    },
                    {
                        "seq": 2,
                        "product_id": mid("vivo-v30"),
                        "product_type": "mobile",
                        "product_name": "Vivo V30",
                        "quantity": 1,
                        "unit_price": Decimal("12490000"),
                    },
                ],
            },
        ]

        for b in bundles:
            total = Decimal("0")
            for it in b["items"]:
                total += it["unit_price"] * it["quantity"]

            note_val = b["note"]
            if note_val == "":
                note_val = None

            order = Order.objects.create(
                id=oid(b["order_idx"]),
                customer_id=cid(b["customer"]),
                total_amount=total,
                status=b["status"],
                payment_method=b["payment_method"],
                payment_status=b["payment_status"],
                shipping_address=b["shipping_address"],
                note=note_val,
            )
            self.stdout.write(
                self.style.SUCCESS(f"✓ Created: Order #{b['order_idx']} ({order.status})")
            )

            for it in b["items"]:
                subtotal = it["unit_price"] * it["quantity"]
                oi = OrderItem.objects.create(
                    id=item_pk(b["order_idx"], it["seq"]),
                    order=order,
                    product_id=it["product_id"],
                    product_type=it["product_type"],
                    product_name=it["product_name"],
                    quantity=it["quantity"],
                    unit_price=it["unit_price"],
                    subtotal=subtotal,
                )
                self.stdout.write(
                    self.style.SUCCESS(f"✓ Created: {oi.product_name}")
                )
