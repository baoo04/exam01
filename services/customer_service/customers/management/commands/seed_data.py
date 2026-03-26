import uuid
from datetime import date

from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand

from customers.models import Customer

SEED_NS = uuid.UUID("00000000-0000-0000-0000-00000000e001")


def cid(idx: int) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"customer:{idx}")


class Command(BaseCommand):
    help = "Seed customers with mock data"

    def handle(self, *args, **options):
        Customer.objects.all().delete()

        customers_data = [
            {
                "id": cid(1),
                "full_name": "Nguyễn Văn An",
                "email": "nguyenvanan@example.com",
                "phone": "0912345678",
                "address": "12 Nguyễn Trãi, Thanh Xuân",
                "city": "Hà Nội",
                "date_of_birth": date(1995, 3, 15),
                "gender": "Nam",
                "avatar_url": "https://picsum.photos/seed/cust-an/128/128",
                "is_active": True,
            },
            {
                "id": cid(2),
                "full_name": "Trần Thị Bích",
                "email": "tranthibich@example.com",
                "phone": "0987654321",
                "address": "45 Lê Văn Sỹ, Quận 3",
                "city": "TP.HCM",
                "date_of_birth": date(1998, 7, 22),
                "gender": "Nữ",
                "avatar_url": "https://picsum.photos/seed/cust-bich/128/128",
                "is_active": True,
            },
            {
                "id": cid(3),
                "full_name": "Lê Hoàng Nam",
                "email": "lehoangnam@example.com",
                "phone": "0367891234",
                "address": "78 Trần Phú, Hải Châu",
                "city": "Đà Nẵng",
                "date_of_birth": date(1992, 11, 8),
                "gender": "Nam",
                "avatar_url": None,
                "is_active": True,
            },
            {
                "id": cid(4),
                "full_name": "Phạm Thị Lan",
                "email": "phamthilan@example.com",
                "phone": "0933123456",
                "address": "90 Nguyễn Văn Cừ, Ninh Kiều",
                "city": "Cần Thơ",
                "date_of_birth": date(2000, 1, 30),
                "gender": "Nữ",
                "avatar_url": "https://picsum.photos/seed/cust-lan/128/128",
                "is_active": True,
            },
            {
                "id": cid(5),
                "full_name": "Hoàng Minh Tuấn",
                "email": "hoangminhtuan@example.com",
                "phone": "0398765432",
                "address": "34 Lạch Tray, Ngô Quyền",
                "city": "Hải Phòng",
                "date_of_birth": date(1994, 5, 19),
                "gender": "Nam",
                "avatar_url": None,
                "is_active": True,
            },
            {
                "id": cid(6),
                "full_name": "Vũ Thị Thu",
                "email": "vuthithu@example.com",
                "phone": "0966888999",
                "address": "56 Giảng Võ, Ba Đình",
                "city": "Hà Nội",
                "date_of_birth": date(1996, 9, 12),
                "gender": "Nữ",
                "avatar_url": "https://picsum.photos/seed/cust-thu/128/128",
                "is_active": True,
            },
            {
                "id": cid(7),
                "full_name": "Đặng Quốc Bảo",
                "email": "dangquocbao@example.com",
                "phone": "0377111222",
                "address": "10 Nguyễn Thị Minh Khai, Quận 1",
                "city": "TP.HCM",
                "date_of_birth": date(1991, 4, 25),
                "gender": "Nam",
                "avatar_url": None,
                "is_active": True,
            },
            {
                "id": cid(8),
                "full_name": "Bùi Thị Hương",
                "email": "buithihuong@example.com",
                "phone": "0944555666",
                "address": "22 Võ Nguyên Giáp, Sơn Trà",
                "city": "Đà Nẵng",
                "date_of_birth": date(1999, 12, 3),
                "gender": "Nữ",
                "avatar_url": "https://picsum.photos/seed/cust-huong/128/128",
                "is_active": True,
            },
            {
                "id": cid(9),
                "full_name": "Ngô Văn Đức",
                "email": "ngovanduc@example.com",
                "phone": "0321999888",
                "address": "5 Phan Đình Phùng, Ninh Kiều",
                "city": "Cần Thơ",
                "date_of_birth": date(1988, 8, 18),
                "gender": "Nam",
                "avatar_url": None,
                "is_active": True,
            },
            {
                "id": cid(10),
                "full_name": "Dương Thị Mai",
                "email": "duongthimai@example.com",
                "phone": "0903111222",
                "address": "18 Minh Khai, Hồng Bàng",
                "city": "Hải Phòng",
                "date_of_birth": date(1997, 6, 7),
                "gender": "Nữ",
                "avatar_url": "https://picsum.photos/seed/cust-mai/128/128",
                "is_active": True,
            },
        ]

        for data in customers_data:
            pk = data["id"]
            defaults = {k: v for k, v in data.items() if k != "id"}
            defaults["password"] = make_password("Khach@123")
            obj, _ = Customer.objects.update_or_create(id=pk, defaults=defaults)
            self.stdout.write(self.style.SUCCESS(f"✓ Created: {obj.full_name}"))
