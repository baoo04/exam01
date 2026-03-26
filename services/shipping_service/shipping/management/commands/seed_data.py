import uuid
from datetime import date, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand

from shipping.models import Shipping

SEED_NS = uuid.UUID("00000000-0000-0000-0000-00000000e001")


def oid(i: int) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"order:{i}")


def ship_pk(i: int) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"shipping:{i}")


class Command(BaseCommand):
    help = "Seed shipping records"

    def handle(self, *args, **options):
        Shipping.objects.all().delete()

        rows = [
            {
                "idx": 1,
                "order": 1,
                "tracking": "VN100023456",
                "carrier": "GHN",
                "status": "preparing",
                "estimated_date": date.today() + timedelta(days=3),
                "actual_date": None,
                "shipping_fee": Decimal("35000"),
                "from_address": "Kho Tân Bình — 45 Bạch Đằng, Phường 2, TP.HCM",
                "to_address": "12 Nguyễn Trãi, Thanh Xuân, Hà Nội",
                "note": "Gói hàng dễ vỡ.",
            },
            {
                "idx": 2,
                "order": 2,
                "tracking": "VN100024567",
                "carrier": "GHTK",
                "status": "picked_up",
                "estimated_date": date.today() + timedelta(days=2),
                "actual_date": None,
                "shipping_fee": Decimal("30000"),
                "from_address": "Trung tâm điều phối — 11 Nguyễn Hữu Thọ, Quận 7, TP.HCM",
                "to_address": "45 Lê Văn Sỹ, Quận 3, TP.HCM",
                "note": None,
            },
            {
                "idx": 3,
                "order": 3,
                "tracking": "VN100025678",
                "carrier": "ViettelPost",
                "status": "in_transit",
                "estimated_date": date.today() + timedelta(days=4),
                "actual_date": None,
                "shipping_fee": Decimal("42000"),
                "from_address": "Kho Đà Nẵng — 120 Điện Biên Phủ, Thanh Khê",
                "to_address": "78 Trần Phú, Hải Châu, Đà Nẵng",
                "note": "Ưu tiên ship sớm.",
            },
            {
                "idx": 4,
                "order": 4,
                "tracking": "VN100026789",
                "carrier": "JT Express",
                "status": "delivered",
                "estimated_date": date.today() - timedelta(days=1),
                "actual_date": date.today() - timedelta(days=1),
                "shipping_fee": Decimal("28000"),
                "from_address": "Kho Cần Thơ — 88 Võ Văn Kiệt, Ninh Kiều",
                "to_address": "90 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ",
                "note": "Đã giao thành công.",
            },
            {
                "idx": 5,
                "order": 5,
                "tracking": "VN100027890",
                "carrier": "GHN",
                "status": "failed",
                "estimated_date": date.today() - timedelta(days=2),
                "actual_date": date.today() - timedelta(days=2),
                "shipping_fee": Decimal("0"),
                "from_address": "Kho Hải Phòng — 22 Trần Nguyên Hãn, Ngô Quyền",
                "to_address": "34 Lạch Tray, Ngô Quyền, Hải Phòng",
                "note": "Không liên lạc được khách — hoàn kho.",
            },
            {
                "idx": 6,
                "order": 6,
                "tracking": "VN100028901",
                "carrier": "GHTK",
                "status": "preparing",
                "estimated_date": date.today() + timedelta(days=5),
                "actual_date": None,
                "shipping_fee": Decimal("40000"),
                "from_address": "Hub Hà Nội — 33 Láng Hạ, Đống Đa",
                "to_address": "56 Giảng Võ, Ba Đình, Hà Nội",
                "note": None,
            },
            {
                "idx": 7,
                "order": 7,
                "tracking": "VN100029012",
                "carrier": "ViettelPost",
                "status": "picked_up",
                "estimated_date": date.today() + timedelta(days=3),
                "actual_date": None,
                "shipping_fee": Decimal("45000"),
                "from_address": "Kho Bình Thạnh — 102 Xô Viết Nghệ Tĩnh, TP.HCM",
                "to_address": "10 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
                "note": "Hàng giá trị cao.",
            },
            {
                "idx": 8,
                "order": 8,
                "tracking": "VN100030123",
                "carrier": "JT Express",
                "status": "in_transit",
                "estimated_date": date.today() + timedelta(days=2),
                "actual_date": None,
                "shipping_fee": Decimal("38000"),
                "from_address": "Kho Đà Nẵng — 15 Quang Trung, Hải Châu",
                "to_address": "22 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
                "note": None,
            },
            {
                "idx": 9,
                "order": 9,
                "tracking": "VN100031234",
                "carrier": "GHN",
                "status": "delivered",
                "estimated_date": date.today() - timedelta(days=3),
                "actual_date": date.today() - timedelta(days=3),
                "shipping_fee": Decimal("32000"),
                "from_address": "Kho TP.HCM — 9 Nguyễn Văn Linh, Quận 7",
                "to_address": "5 Phan Đình Phùng, Ninh Kiều, Cần Thơ",
                "note": "Khách hài lòng.",
            },
            {
                "idx": 10,
                "order": 10,
                "tracking": "VN100032345",
                "carrier": "GHTK",
                "status": "preparing",
                "estimated_date": date.today() + timedelta(days=4),
                "actual_date": None,
                "shipping_fee": Decimal("36000"),
                "from_address": "Kho Hải Phòng — 7 Tôn Đức Thắng, Hồng Bàng",
                "to_address": "18 Minh Khai, Hồng Bàng, Hải Phòng",
                "note": "Chờ lấy hàng.",
            },
        ]

        for r in rows:
            obj = Shipping.objects.create(
                id=ship_pk(r["idx"]),
                order_id=oid(r["order"]),
                tracking_code=r["tracking"],
                carrier=r["carrier"],
                status=r["status"],
                estimated_date=r["estimated_date"],
                actual_date=r["actual_date"],
                shipping_fee=r["shipping_fee"],
                from_address=r["from_address"],
                to_address=r["to_address"],
                note=r["note"],
            )
            self.stdout.write(self.style.SUCCESS(f"✓ Created: {obj.tracking_code}"))
