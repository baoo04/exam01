import uuid
from datetime import date
from decimal import Decimal

from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand

from staffs.models import Staff

SEED_NS = uuid.UUID("00000000-0000-0000-0000-00000000e001")


def sid(idx: int) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"staff:{idx}")


class Command(BaseCommand):
    help = "Seed staff with mock data"

    def handle(self, *args, **options):
        Staff.objects.all().delete()

        staff_data = [
            {
                "id": sid(1),
                "full_name": "Nguyễn Quốc Huy",
                "email": "nguyenquochuy@shop.vn",
                "phone": "0911000111",
                "role": "Admin",
                "department": "Quản trị hệ thống",
                "salary": Decimal("25000000"),
                "hire_date": date(2019, 4, 1),
                "is_active": True,
            },
            {
                "id": sid(2),
                "full_name": "Phan Thu Hà",
                "email": "phanhuha@shop.vn",
                "phone": "0922000222",
                "role": "Sales",
                "department": "Kinh doanh miền Bắc",
                "salary": Decimal("12500000"),
                "hire_date": date(2020, 8, 15),
                "is_active": True,
            },
            {
                "id": sid(3),
                "full_name": "Trịnh Công Vinh",
                "email": "trinhcongvinh@shop.vn",
                "phone": "0933000333",
                "role": "Warehouse",
                "department": "Kho TP.HCM",
                "salary": Decimal("9500000"),
                "hire_date": date(2021, 2, 10),
                "is_active": True,
            },
            {
                "id": sid(4),
                "full_name": "Lý Minh Khang",
                "email": "lyminhkhang@shop.vn",
                "phone": "0944000444",
                "role": "Support",
                "department": "CSKH Online",
                "salary": Decimal("8900000"),
                "hire_date": date(2022, 1, 20),
                "is_active": True,
            },
            {
                "id": sid(5),
                "full_name": "Mai Phương Thảo",
                "email": "maiphuongthao@shop.vn",
                "phone": "0355000555",
                "role": "Sales",
                "department": "Kinh doanh miền Nam",
                "salary": Decimal("11800000"),
                "hire_date": date(2019, 11, 5),
                "is_active": True,
            },
            {
                "id": sid(6),
                "full_name": "Đỗ Văn Kiệt",
                "email": "dovankiet@shop.vn",
                "phone": "0366000666",
                "role": "Warehouse",
                "department": "Kho Hà Nội",
                "salary": Decimal("8200000"),
                "hire_date": date(2023, 3, 12),
                "is_active": True,
            },
            {
                "id": sid(7),
                "full_name": "Hồ Ngọc Lam",
                "email": "hongoclam@shop.vn",
                "phone": "0377000777",
                "role": "Support",
                "department": "Hotline 24/7",
                "salary": Decimal("9100000"),
                "hire_date": date(2021, 6, 1),
                "is_active": True,
            },
            {
                "id": sid(8),
                "full_name": "Võ Thành Đạt",
                "email": "vothanhdat@shop.vn",
                "phone": "0388000888",
                "role": "Admin",
                "department": "An ninh dữ liệu",
                "salary": Decimal("19800000"),
                "hire_date": date(2020, 9, 9),
                "is_active": True,
            },
        ]

        for data in staff_data:
            pk = data["id"]
            defaults = {k: v for k, v in data.items() if k != "id"}
            defaults["password"] = make_password("Staff@123")
            obj, _ = Staff.objects.update_or_create(id=pk, defaults=defaults)
            self.stdout.write(self.style.SUCCESS(f"✓ Created: {obj.full_name}"))
