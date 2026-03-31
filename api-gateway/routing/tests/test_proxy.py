from unittest.mock import patch

import requests
from django.test import Client, TestCase

from routing.services.proxy import resolve_upstream


class ProxyRoutingTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_resolve_customer_auth_alias(self):
        target = resolve_upstream("/api/auth/customer/login/")
        self.assertIsNotNone(target)
        self.assertEqual(target.service, "customer_service")
        self.assertEqual(target.port, 8003)
        self.assertEqual(target.path, "/api/auth/login/")

    def test_resolve_staff_auth_alias(self):
        target = resolve_upstream("/api/auth/staff/me/")
        self.assertIsNotNone(target)
        self.assertEqual(target.service, "staff_service")
        self.assertEqual(target.port, 8004)
        self.assertEqual(target.path, "/api/auth/me/")

    @patch("routing.views.requests.request")
    def test_proxy_timeout_returns_504(self, mocked_request):
        mocked_request.side_effect = requests.Timeout()
        response = self.client.get("/api/laptops/")
        self.assertEqual(response.status_code, 504)

    @patch("routing.views.requests.request")
    def test_proxy_connection_error_returns_502(self, mocked_request):
        mocked_request.side_effect = requests.ConnectionError()
        response = self.client.get("/api/laptops/")
        self.assertEqual(response.status_code, 502)
