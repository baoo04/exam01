import uuid
from decimal import Decimal

from django.core.management.base import BaseCommand

from clothing.models import Clothing

SEED_NS = uuid.UUID("00000000-0000-0000-0000-00000000e001")


def gid(key: str) -> uuid.UUID:
    return uuid.uuid5(SEED_NS, f"clothes:{key}")


class Command(BaseCommand):
    help = "Seed clothing catalog"

    def handle(self, *args, **options):
        Clothing.objects.all().delete()

        rows = [
            {
                "id": gid("canifa-sm-nam"),
                "name": "Áo sơ mi dài tay Canifa",
                "brand": "Canifa",
                "category": "Áo sơ mi",
                "gender": "Nam",
                "size": "L",
                "color": "Trắng",
                "material": "Cotton 100%",
                "price": Decimal("399000"),
                "stock": 45,
                "image_url": "https://picsum.photos/seed/canifa-sm/480/320",
                "description": "Form regular, dễ phối công sở.",
            },
            {
                "id": gid("yody-polo-nu"),
                "name": "Áo polo nữ Yody",
                "brand": "Yody",
                "category": "Áo polo",
                "gender": "Nữ",
                "size": "M",
                "color": "Hồng pastel",
                "material": "Cotton pha spandex",
                "price": Decimal("259000"),
                "stock": 60,
                "image_url": "https://picsum.photos/seed/yody-polo/480/320",
                "description": "Thoáng mát, co giãn nhẹ.",
            },
            {
                "id": gid("ivymoda-dam"),
                "name": "Đầm công sở Ivy moda",
                "brand": "Ivy moda",
                "category": "Đầm",
                "gender": "Nữ",
                "size": "S",
                "color": "Đen",
                "material": "Polyester cao cấp",
                "price": Decimal("890000"),
                "stock": 22,
                "image_url": "https://picsum.photos/seed/ivy-dam/480/320",
                "description": "Tôn dáng, có túi hai bên.",
            },
            {
                "id": gid("routine-jean-nam"),
                "name": "Quần jean slim Routine",
                "brand": "Routine",
                "category": "Quần jean",
                "gender": "Nam",
                "size": "32",
                "color": "Xanh đậm",
                "material": "Denim",
                "price": Decimal("599000"),
                "stock": 38,
                "image_url": "https://picsum.photos/seed/routine-jean/480/320",
                "description": "Co nhẹ, không bạc màu nhanh.",
            },
            {
                "id": gid("bitis-giay-the-thao"),
                "name": "Giày thể thao Biti's Hunter",
                "brand": "Biti's",
                "category": "Giày dép",
                "gender": "Unisex",
                "size": "42",
                "color": "Trắng đen",
                "material": "Mesh + cao su",
                "price": Decimal("749000"),
                "stock": 50,
                "image_url": "https://picsum.photos/seed/bitis-hunter/480/320",
                "description": "Đế êm, phù hợp đi bộ hàng ngày.",
            },
            {
                "id": gid("anphuoc-ao-dai"),
                "name": "Áo dài lụa An Phước",
                "brand": "An Phước",
                "category": "Áo dài",
                "gender": "Nữ",
                "size": "M",
                "color": "Vàng nhạt",
                "material": "Lụa tơ tằm",
                "price": Decimal("2450000"),
                "stock": 8,
                "image_url": "https://picsum.photos/seed/anphuoc-aodai/480/320",
                "description": "May đo chuẩn, họa tiết nhẹ.",
            },
            {
                "id": gid("coolmate-tank"),
                "name": "Áo tank top nam Coolmate",
                "brand": "Coolmate",
                "category": "Áo thun",
                "gender": "Nam",
                "size": "XL",
                "color": "Xám melange",
                "material": "Cotton",
                "price": Decimal("179000"),
                "stock": 70,
                "image_url": "https://picsum.photos/seed/coolmate-tank/480/320",
                "description": "Tập gym, mồ hôi nhanh khô.",
            },
            {
                "id": gid("shein-vay-mini"),
                "name": "Chân váy mini xếp ly",
                "brand": "Shein VN",
                "category": "Váy",
                "gender": "Nữ",
                "size": "S",
                "color": "Be",
                "material": "Polyester",
                "price": Decimal("320000"),
                "stock": 33,
                "image_url": "https://picsum.photos/seed/shein-vay/480/320",
                "description": "Phối cùng áo crop top.",
            },
            {
                "id": gid("levis-ao-khoac"),
                "name": "Áo khoác denim Levi's",
                "brand": "Levi's",
                "category": "Áo khoác",
                "gender": "Unisex",
                "size": "M",
                "color": "Xanh classic",
                "material": "Denim",
                "price": Decimal("1890000"),
                "stock": 15,
                "image_url": "https://picsum.photos/seed/levis-jacket/480/320",
                "description": "Logo sau gáy, cúc đồng.",
            },
            {
                "id": gid("uniqlo-heattech"),
                "name": "Áo giữ nhiệt Heattech Uniqlo",
                "brand": "Uniqlo",
                "category": "Áo thun",
                "gender": "Nam",
                "size": "M",
                "color": "Đen",
                "material": "Acrylic + polyester",
                "price": Decimal("490000"),
                "stock": 55,
                "image_url": "https://picsum.photos/seed/uniqlo-heat/480/320",
                "description": "Siêu nhẹ, mặc lót trong áo sơ mi.",
            },
            {
                "id": gid("zara-blazer"),
                "name": "Blazer nữ Zara",
                "brand": "Zara",
                "category": "Áo khoác",
                "gender": "Nữ",
                "size": "M",
                "color": "Kem",
                "material": "Vải dệt kim",
                "price": Decimal("1590000"),
                "stock": 12,
                "image_url": "https://picsum.photos/seed/zara-blazer/480/320",
                "description": "Form oversized, vai chờm.",
            },
            {
                "id": gid("local-brand-quan-short"),
                "name": "Quần short kaki Local Brand",
                "brand": "Degrey",
                "category": "Quần short",
                "gender": "Nam",
                "size": "L",
                "color": "Rêu",
                "material": "Kaki",
                "price": Decimal("429000"),
                "stock": 40,
                "image_url": "https://picsum.photos/seed/degrey-short/480/320",
                "description": "Túi sau có khóa YKK.",
            },
            {
                "id": gid("loship-ao-mua"),
                "name": "Áo mưa tiện lợi",
                "brand": "Rainy",
                "category": "Phụ kiện",
                "gender": "Unisex",
                "size": "Free size",
                "color": "Vàng tươi",
                "material": "PVC pha PE",
                "price": Decimal("89000"),
                "stock": 200,
                "image_url": "https://picsum.photos/seed/raincoat/480/320",
                "description": "Gấp gọn, đi xe máy.",
            },
            {
                "id": gid("nem-pyjama"),
                "name": "Bộ đồ ngủ cotton Nem fashion",
                "brand": "Nem fashion",
                "category": "Đồ ngủ",
                "gender": "Nữ",
                "size": "L",
                "color": "Xanh pastel",
                "material": "Cotton",
                "price": Decimal("350000"),
                "stock": 28,
                "image_url": "https://picsum.photos/seed/nem-pyjama/480/320",
                "description": "Gồm áo tay ngắn + quần dài.",
            },
            {
                "id": gid("vascara-clutch"),
                "name": "Túi clutch Vascara",
                "brand": "Vascara",
                "category": "Phụ kiện",
                "gender": "Nữ",
                "size": "—",
                "color": "Đỏ đô",
                "material": "Da tổng hợp",
                "price": Decimal("650000"),
                "stock": 18,
                "image_url": "https://picsum.photos/seed/vascara-bag/480/320",
                "description": "Dây đeo vai tháo rác.",
            },
        ]

        for data in rows:
            pk = data["id"]
            defaults = {k: v for k, v in data.items() if k != "id"}
            obj, _ = Clothing.objects.update_or_create(id=pk, defaults=defaults)
            self.stdout.write(self.style.SUCCESS(f"✓ Created: {obj.name}"))

</think>


<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
Read