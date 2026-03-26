"""
Mock registry — danh sách route gateway (production có thể sync từ DB hoặc service discovery).
"""

ROUTING_MATRIX = [
    {
        "path_prefix": "/api/laptops/",
        "upstream": "laptop_service",
        "port": 8001,
        "db": "postgres / laptop_db",
    },
    {
        "path_prefix": "/api/mobiles/",
        "upstream": "mobile_service",
        "port": 8002,
        "db": "postgres / mobile_db",
    },
    {
        "path_prefix": "/api/clothes/",
        "upstream": "clothes_service",
        "port": 8008,
        "db": "postgres / clothes_db",
    },
    {
        "path_prefix": "/api/customers/",
        "upstream": "customer_service",
        "port": 8003,
        "db": "mysql / customer_db",
    },
    {
        "path_prefix": "/api/staff/",
        "upstream": "staff_service",
        "port": 8004,
        "db": "mysql / staff_db",
    },
    {
        "path_prefix": "/api/orders/",
        "upstream": "order_service",
        "port": 8005,
        "db": "mysql / order_db",
    },
    {
        "path_prefix": "/api/cart/",
        "upstream": "cart_service",
        "port": 8006,
        "db": "mysql / cart_db",
    },
    {
        "path_prefix": "/api/shipping/",
        "upstream": "shipping_service",
        "port": 8007,
        "db": "mysql / shipping_db",
    },
]
