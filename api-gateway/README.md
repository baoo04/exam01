# API Gateway — Django microservice

Service **Django 4 + Django REST Framework**, tách riêng khỏi `frontend`, đóng vai trò **API Gateway**: healthcheck, **catalog route** (DB + API), ma trận routing tĩnh, Django Admin, lệnh `seed_routes`, và proxy request tới upstream services.

## Cấu trúc thư mục

Xem [`docs/CAY_THU_MUC.md`](docs/CAY_THU_MUC.md).

## Chạy bằng Docker Compose (khuyến nghị)

Từ `ecommerce-microservices/`:

```bash
docker compose up -d --build api_gateway
curl http://localhost:8090/
curl http://localhost:8090/api/health/
curl http://localhost:8090/api/gateway/matrix/
curl http://localhost:8090/api/gateway/catalog/
```

- **SQLite** lưu tại `data/gateway.sqlite3` trong container.
- Lúc start: `migrate` → `seed_routes` → `gunicorn :80`.

## Chạy local (không Docker)

```bash
cd api-gateway
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed_routes
python manage.py runserver 8090
```

## Tests

```bash
python manage.py test routing
```

## Endpoint tóm tắt

| Path | Mô tả |
|------|--------|
| `GET /` | JSON metadata service |
| `GET /api/health/` | Health (thống nhất kiểu microservice) |
| `GET /api/gateway/matrix/` | Ma trận route mock (`upstream_registry.py`) |
| `GET /api/gateway/catalog/` | Route đã seed trong DB (Read-only API) |
| `POST /api/auth/customer/login/` | Alias auth customer (proxy sang `customer_service`) |
| `GET /api/auth/customer/me/` | Alias auth customer (proxy sang `customer_service`) |
| `POST /api/auth/staff/login/` | Alias auth staff (proxy sang `staff_service`) |
| `GET /api/auth/staff/me/` | Alias auth staff (proxy sang `staff_service`) |
| `/api/<service-prefix>/...` | Proxy request tới upstream tương ứng |
| `/admin/` | Quản lý `GatewayRoute` |

## Bảng ánh xạ (cùng hệ thống)

| Prefix | Upstream |
|--------|----------|
| `/api/laptops/` | laptop_service:8001 |
| `/api/mobiles/` | mobile_service:8002 |
| `/api/clothes/` | clothes_service:8008 |
| `/api/customers/` | customer_service:8003 |
| `/api/staff/` | staff_service:8004 |
| `/api/orders/` | order_service:8005 |
| `/api/cart/` | cart_service:8006 |
| `/api/shipping/` | shipping_service:8007 |
