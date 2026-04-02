# E‑Commerce microservices (Django + React + Docker)

Hệ thống gồm **8 microservice Django** (REST + seed), **React 18 (Vite + Tailwind)** và **Docker Compose**: PostgreSQL 16 cho laptop/mobile/quần áo, MySQL 8 cho các dịch vụ còn lại.

## Run with Docker (recommended)

```bash
cp .env.example .env
# Chỉnh mật khẩu trong .env nếu cần

# Sao chép biến môi trường cho từng service Django (Compose cần file .env tồn tại)
cp services/laptop_service/.env.example services/laptop_service/.env
cp services/mobile_service/.env.example services/mobile_service/.env
cp services/customer_service/.env.example services/customer_service/.env
cp services/staff_service/.env.example services/staff_service/.env
cp services/order_service/.env.example services/order_service/.env
cp services/cart_service/.env.example services/cart_service/.env
cp services/shipping_service/.env.example services/shipping_service/.env
cp services/clothes_service/.env.example services/clothes_service/.env

docker-compose up --build -d
docker-compose ps
docker-compose logs -f
```

- Mỗi container Django chạy `migrate`, `seed_data`, rồi `runserver` trên cổng riêng.
- Lần đầu Postgres/MySQL khởi tạo volume **trống** mới chạy `init-postgres.sql` / `init-mysql.sql` (xem mục dưới).

### pgAdmin / MySQL Workbench — phải đúng **cổng Docker**

Các DB **`laptop_db`**, **`mobile_db`**, **`customer_db`**, … chỉ được tạo **trong container** (volume Docker). Nếu trong Workbench/pgAdmin bạn kết nối tới **Postgres cổng 5432** hoặc **MySQL cổng 3306** trên Windows, đó thường là **bản cài đặt cục bộ trên máy**, **không phải** DB của stack này → sẽ **không thấy** các database đã init.

| Công cụ | Host | Cổng (host) | User | Mật khẩu |
|--------|------|-------------|------|----------|
| PostgreSQL (container `postgres_db`) | `127.0.0.1` | **5433** | `postgres` | Giá trị `POSTGRES_PASSWORD` trong file `.env` gốc |
| MySQL (container `mysql_db`) | `127.0.0.1` | **13306** | `root` | Giá trị `MYSQL_PASSWORD` trong file `.env` gốc |

**Database sau khi init thành công:**

- Postgres: `postgres` (mặc định), **`laptop_db`**, **`mobile_db`**, **`clothes_db`**
- MySQL: `customer_db`, `staff_db`, `order_db`, `cart_db`, `shipping_db` (+ schema hệ thống)

### Script init **chỉ chạy một lần** (khi volume rỗng)

File trong `docker-entrypoint-initdb.d/` **không chạy lại** nếu volume `pg_data` / `mysql_data` đã tồn tại từ lần chạy trước (trước khi có script, hoặc DB đã khởi tạo lỗi một phần).

**Cách xử lý:**

1. Xóa volume và tạo lại (xóa hết dữ liệu trong Docker cho 2 DB này):

   ```bash
   docker compose down -v
   docker compose up -d postgres_db mysql_db
   # đợi healthy rồi: docker compose up -d
   ```

2. Hoặc **tạo DB thủ công** bằng cách chạy nội dung file `init-postgres.sql` / `init-mysql.sql` trong kết nối tới **đúng cổng 5433 / 13306**.

**Thêm `clothes_db` khi volume Postgres đã tồn tại từ trước (init không chạy lại):** kết nối pgAdmin/DBeaver tới `localhost:5433`, user `postgres`, rồi thực thi `CREATE DATABASE clothes_db;`. Sau đó rebuild hoặc trong container `clothes_service`: `python manage.py migrate && python manage.py seed_data`.

**Kiểm tra nhanh trong terminal:**

```bash
docker compose ps postgres_db mysql_db
docker exec -it $(docker compose ps -q postgres_db) psql -U postgres -c "\l"
docker exec -it $(docker compose ps -q mysql_db) mysql -uroot -p -e "SHOW DATABASES;"
```

(Lệnh MySQL sẽ hỏi mật khẩu root = `MYSQL_PASSWORD` trong `.env`.)

### Access points after `docker-compose up`

| Ứng dụng | URL |
|----------|-----|
| Frontend (Nginx) | http://localhost |
| Laptops API | http://localhost:8001/api/laptops/ |
| Mobiles API | http://localhost:8002/api/mobiles/ |
| Clothes API | http://localhost:8008/api/clothes/ |
| Customers API | http://localhost:8003/api/customers/ |
| Staff API | http://localhost:8004/api/staff/ |
| Orders API | http://localhost:8005/api/orders/ |
| Cart API | http://localhost:8006/api/cart/ |
| Shipping API | http://localhost:8007/api/shipping/ |
| Health (mỗi service) | `GET /api/health/` |
| **API Gateway** (Django: health + catalog route mock) | http://localhost:8090/ — ` /api/health/`, ` /api/gateway/catalog/`, ` /api/gateway/matrix/` |

Nginx trong container `frontend` reverse proxy `/api/...` tới từng service (cùng origin với UI). Thư mục **`api-gateway/`** là service **`api_gateway`** (Compose): chỉ định tuyến API, phù hợp ghi vào sơ đồ “client → API Gateway → microservices”. Chi tiết và bảng route: `api-gateway/README.md`.

## Run without Docker (manual)

**Backend (ví dụ laptop):**

```bash
cd services/laptop_service
pip install -r requirements.txt
cp .env.example .env   # điền DB và SECRET_KEY
python manage.py migrate
python manage.py seed_data
python manage.py runserver 8001
```

Lặp lại cho từng service với cổng tương ứng (8002–8008, bỏ qua khoảng trống nếu có) và database đúng loại (Postgres / MySQL). **Clothes:** `cd services/clothes_service`, DB `clothes_db` trên Postgres, `runserver 8008`.

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Mở http://localhost:5173 — các file `src/api/*.js` trỏ tới `http://localhost:8001` … `8008` (CORS đã bật cho `5173` và `localhost`).

### Chức năng tương tác (UI)

- **Đăng nhập / đăng ký**: `/login`, `/dang-ky` (khách hàng). Sidebar có Đăng xuất khi đã đăng nhập.
- **Khách**: sau khi đăng nhập, trang Laptop / Điện thoại / **Quần áo** (`/clothes`) có nút **Thêm vào giỏ**; trang **Giỏ hàng** chỉ hiển thị giỏ của tài khoản đó.
- **Nhân viên (kho)**: đăng nhập tab *Nhân viên* → menu **Kho laptop** / **Kho điện thoại** / **Kho quần áo** (`/staff/kho-laptop`, `/staff/kho-mobile`, `/staff/kho-clothes`): thêm / sửa / xóa sản phẩm, **Nhập kho** (cộng/trừ tồn qua API `receive-stock`).
- **API đăng nhập**: `POST /api/auth/login/` trên **staff_service** (8004) và **customer_service** (8003), body JSON `{ "email", "password" }`.

**Tài khoản demo (sau `seed_data`):**

| Vai trò  | Email | Mật khẩu |
|----------|-------|----------|
| Nhân viên | `nguyenquochuy@shop.vn` | `Staff@123` |
| Khách | `nguyenvanan@example.com` | `Khach@123` |

Sau khi thêm migration mật khẩu: `docker compose up --build -d` (hoặc trong container: `python manage.py migrate`).

### Ảnh sản phẩm (`image_url`)

- Trường Django **`URLField`** mặc định chỉ **200 ký tự**; link CDN dài (query string, signed URL) dễ vượt → đã tăng lên **2000** cho `image_url` / `avatar_url` (chạy `migrate`).
- Seed dùng URL ngắn, ảnh thật: **`https://picsum.photos/seed/<chuỗi>/480/320`** (mỗi `seed` khác nhau → ảnh khác nhau).
- Khi tự nhập link: ưu tiên URL **ngắn**, hoặc dùng dịch vụ rút gọn; tránh link dài hơn **2000** ký tự.

## Troubleshoot

- **MySQL chưa sẵn sàng** → `docker-compose restart <tên_service>` hoặc chờ healthcheck xanh rồi khởi động lại service Django.
- **`bind: ... 3306: Only one usage` (hoặc trùng Postgres 5432)** → Trên máy bạn đã có MySQL/Postgres cục bộ. Trong `docker-compose.yml`, service `mysql_db` publish **`13306:3306`** (kết nối từ máy thật: `localhost:13306`). Postgres dùng **`5433:5432`**. Nếu vẫn trùng, đổi số bên trái (host) sang cổng trống, hoặc **xóa hẳn khối `ports:`** của `mysql_db`/`postgres_db` nếu bạn không cần Workbench/DBeaver vào container (các service Django vẫn gọi được DB qua mạng nội bộ Docker).
- **Trùng cổng** → `netstat -ano | findstr :8001` (Windows) hoặc `lsof -i :8001` (Unix) để xem process chiếm cổng.
- **Reset data & volume** → `docker-compose down -v && docker-compose up --build -d`.

## Cấu trúc thư mục

- `services/*` — từng Django project + app + `Dockerfile` + `requirements.txt`.
- `frontend/` — Vite + React + Tailwind + Nginx image.
- `docker-compose.yml` — Postgres, MySQL, 8 API, **api_gateway**, frontend.
- `api-gateway/` — **Django** API Gateway service (Gunicorn, cổng host **8090**): `gateway_service` + app `routing`, SQLite, seed route.
- `init-postgres.sql` / `init-mysql.sql` — tạo database lúc khởi tạo volume.
