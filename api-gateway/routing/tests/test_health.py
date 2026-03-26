from django.test import Client, TestCase


class GatewayHealthTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_root_returns_json(self):
        r = self.client.get("/")
        self.assertEqual(r.status_code, 200)
        self.assertIn("api_gateway", r.json().get("service", ""))

    def test_api_health(self):
        r = self.client.get("/api/health/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json().get("status"), "ok")
