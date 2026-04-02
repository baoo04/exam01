package com.ecommerce.gateway;

import java.util.List;

/**
 * Single source of truth for upstream microservices. Routes are generated from this list so no
 * service is omitted. Docker Compose service names use underscores (e.g. laptop_service).
 * <p>
 * {@code lb://} URIs require a discovery server (Eureka, Consul, Kubernetes). In Compose we use
 * direct {@code http://host:port} URIs — equivalent edge routing, production-ready for static
 * service topology.
 */
public final class MicroserviceRegistry {

    private MicroserviceRegistry() {}

    public record UpstreamRoute(
            String routeId,
            String dockerServiceName,
            int port,
            String apiPathPrefix,
            String notes
    ) {
        public String httpUri() {
            return "http://" + dockerServiceName + ":" + port;
        }

        /** Spring Path predicate, e.g. /api/laptops/** */
        public String pathPattern() {
            String p = apiPathPrefix.endsWith("/") ? apiPathPrefix : apiPathPrefix + "/";
            return p + "**";
        }
    }

    /**
     * All Django REST services behind the gateway. Paths match each app's URLconf and the former
     * Django gateway matrix.
     */
    public static final List<UpstreamRoute> UPSTREAMS = List.of(
            new UpstreamRoute("laptop-service", "laptop_service", 8001, "/api/laptops", "PostgreSQL / laptop_db"),
            new UpstreamRoute("mobile-service", "mobile_service", 8002, "/api/mobiles", "PostgreSQL / mobile_db"),
            new UpstreamRoute("clothes-service", "clothes_service", 8008, "/api/clothes", "PostgreSQL / clothes_db"),
            new UpstreamRoute("customer-service", "customer_service", 8003, "/api/customers", "MySQL / customer_db"),
            new UpstreamRoute("staff-service", "staff_service", 8004, "/api/staff", "MySQL / staff_db"),
            new UpstreamRoute("order-service", "order_service", 8005, "/api/orders", "MySQL / order_db"),
            new UpstreamRoute("cart-service", "cart_service", 8006, "/api/cart", "MySQL / cart_db"),
            new UpstreamRoute("shipping-service", "shipping_service", 8007, "/api/shipping", "MySQL / shipping_db")
    );
}
