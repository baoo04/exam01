package com.ecommerce.gateway;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Programmatic routes: auth path rewrites + one route per {@link MicroserviceRegistry#UPSTREAMS}
 * entry + SPA fallback. Host header is set to {@code localhost} so upstream Django rejects
 * underscore hostnames (RFC 1034) from internal Docker DNS names.
 */
@Configuration
public class GatewayConfiguration {

    private static final String LOCALHOST_HOST = "localhost";

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        RouteLocatorBuilder.Builder routes = builder.routes();

        routes
                .route(
                        "api-auth-customer",
                        r -> r.path("/api/auth/customer/**")
                                .filters(
                                        f -> f.rewritePath(
                                                        "/api/auth/customer/(?<segment>.*)",
                                                        "/api/auth/${segment}")
                                                .addRequestHeader("Host", LOCALHOST_HOST))
                                .uri("http://customer_service:8003"))
                .route(
                        "api-auth-staff",
                        r -> r.path("/api/auth/staff/**")
                                .filters(
                                        f -> f.rewritePath(
                                                        "/api/auth/staff/(?<segment>.*)",
                                                        "/api/auth/${segment}")
                                                .addRequestHeader("Host", LOCALHOST_HOST))
                                .uri("http://staff_service:8004"));

        for (MicroserviceRegistry.UpstreamRoute u : MicroserviceRegistry.UPSTREAMS) {
            routes.route(
                    u.routeId(),
                    r -> r.path(u.pathPattern())
                            .filters(f -> f.addRequestHeader("Host", LOCALHOST_HOST))
                            .uri(u.httpUri()));
        }

        routes.route(
                "frontend-spa",
                r -> r.path("/**").uri("http://frontend:80"));

        return routes.build();
    }
}
