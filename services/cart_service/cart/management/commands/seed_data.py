import uuid
from decimal import Decimal

from django.core.management.base import BaseCommand

from cart.models import Cart, CartItem

SEED_NS = uuid.UUID("00000000-0000-0000-0000-00000000e001")


def cid(i: int) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"customer:{i}")


def lid(key: str) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"laptop:{key}")


def mid(key: str) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"mobile:{key}")


def cart_id(i: int) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"cart:{i}")


def cart_item_pk(cart_idx: int, seq: int) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"cart:{cart_idx}:item:{seq}")


class Command(BaseCommand):
    help = "Seed carts and cart items"

    def handle(self, *args, **options):
        Cart.objects.all().delete()

        bundles = [
            {
                "cart_idx": 1,
                "customer": 1,
                "items": [
                    {
                        "seq": 1,
                        "product_id": lid("dell-inspiron-15"),
                        "product_type": "laptop",
                        "product_name": "Dell Inspiron 15",
                        "quantity": 1,
                        "unit_price": Decimal("15990000"),
                    },
                ],
            },
            {
                "cart_idx": 2,
                "customer": 2,
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
                        "product_id": mid("oppo-a98"),
                        "product_type": "mobile",
                        "product_name": "Oppo A98",
                        "quantity": 2,
                        "unit_price": Decimal("7990000"),
                    },
                ],
            },
            {
                "cart_idx": 3,
                "customer": 3,
                "items": [
                    {
                        "seq": 1,
                        "product_id": lid("hp-envy-x360"),
                        "product_type": "laptop",
                        "product_name": "HP Envy x360",
                        "quantity": 1,
                        "unit_price": Decimal("18990000"),
                    },
                    {
                        "seq": 2,
                        "product_id": lid("asus-vivobook-15"),
                        "product_type": "laptop",
                        "product_name": "Asus VivoBook 15",
                        "quantity": 1,
                        "unit_price": Decimal("13990000"),
                    },
                    {
                        "seq": 3,
                        "product_id": mid("realme-gt-5"),
                        "product_type": "mobile",
                        "product_name": "Realme GT 5",
                        "quantity": 1,
                        "unit_price": Decimal("14990000"),
                    },
                ],
            },
            {
                "cart_idx": 4,
                "customer": 4,
                "items": [
                    {
                        "seq": 1,
                        "product_id": mid("galaxy-a55"),
                        "product_type": "mobile",
                        "product_name": "Samsung Galaxy A55",
                        "quantity": 3,
                        "unit_price": Decimal("8990000"),
                    },
                ],
            },
            {
                "cart_idx": 5,
                "customer": 5,
                "items": [
                    {
                        "seq": 1,
                        "product_id": lid("apple-macbook-air-m2"),
                        "product_type": "laptop",
                        "product_name": "Apple MacBook Air M2",
                        "quantity": 1,
                        "unit_price": Decimal("25990000"),
                    },
                    {
                        "seq": 2,
                        "product_id": mid("nothing-phone-2"),
                        "product_type": "mobile",
                        "product_name": "Nothing Phone 2",
                        "quantity": 1,
                        "unit_price": Decimal("15990000"),
                    },
                ],
            },
        ]

        for b in bundles:
            cart = Cart.objects.create(
                id=cart_id(b["cart_idx"]),
                customer_id=cid(b["customer"]),
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f"✓ Created: Giỏ #{b['cart_idx']} (khách {b['customer']})"
                )
            )

            for it in b["items"]:
                ci = CartItem.objects.create(
                    id=cart_item_pk(b["cart_idx"], it["seq"]),
                    cart=cart,
                    product_id=it["product_id"],
                    product_type=it["product_type"],
                    product_name=it["product_name"],
                    quantity=it["quantity"],
                    unit_price=it["unit_price"],
                )
                self.stdout.write(self.style.SUCCESS(f"✓ Created: {ci.product_name}"))
