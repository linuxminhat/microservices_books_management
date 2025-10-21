package com.luv2code.apigateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import java.util.HashMap;
import java.util.Map;

@RestController
public class FallbackController {
    @RequestMapping("/fallback")
    public Mono<ResponseEntity<Map<String, String>>> fallback() {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Service is temporarily unavailable. Please try again later.");
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }
}