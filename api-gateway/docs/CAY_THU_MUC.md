# Cấu trúc api-gateway (Django microservice)

```
api-gateway/
├── manage.py
├── requirements.txt
├── Dockerfile
├── .env.example
├── docs/
│   └── CAY_THU_MUC.md          ← file này
├── gateway_service/             # Django project
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── data/                        # SQLite (tạo khi chạy; có thể .gitignore)
│   └── gateway.sqlite3
└── routing/                     # App định tuyến / catalog
    ├── admin.py
    ├── apps.py
    ├── models.py                # GatewayRoute
    ├── serializers.py
    ├── views.py
    ├── urls.py
    ├── migrations/
    ├── management/commands/
    │   └── seed_routes.py
    ├── services/
    │   └── upstream_registry.py # Mock ROUTING_MATRIX
    └── tests/
        └── test_health.py
```

Endpoint chính (mock, chụp Postman / báo cáo):

| Method | Path | Mô tả |
|--------|------|--------|
| GET | `/` | Thông tin service |
| GET | `/api/health/` | Healthcheck |
| GET | `/api/gateway/matrix/` | JSON matrix tĩnh |
| GET | `/api/gateway/catalog/` | Danh sách route từ DB (sau seed) |
| GET | `/admin/` | Django admin (catalog DB) |
