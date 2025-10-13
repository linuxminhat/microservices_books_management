package com.luv2code.configserver;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class WelcomeController {

    @Value("${server.port}")
    private String port;

    @Value("${spring.application.name}")
    private String applicationName;

    @GetMapping("/")
    public Map<String, Object> welcome() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "🎉 Chào mừng đến với Config Server!");
        response.put("service", applicationName);
        response.put("port", port);
        response.put("status", "✅ Đang hoạt động");
        response.put("endpoints", Map.of(
                "health", "http://localhost:" + port + "/actuator/health",
                "info", "http://localhost:" + port + "/actuator/info",
                "config_example", "http://localhost:" + port + "/book-service/default"));
        response.put("available_configs", new String[] {
                "book-service", "api-gateway", "admin-service",
                "review-service", "message-service", "eureka-server"
        });
        return response;
    }

    @GetMapping("/status")
    public Map<String, String> status() {
        Map<String, String> status = new HashMap<>();
        status.put("service", "Config Server");
        status.put("status", "UP");
        status.put("port", port);
        return status;
    }
}