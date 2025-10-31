package com.luv2code.adminservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "auth-service", url = "http://localhost:8081",
        configuration = com.luv2code.adminservice.config.FeignConfig.class)
public interface AuthUserClient {

    @GetMapping("/api/auth/admin/users")
    List<Map<String, Object>> list();

    @GetMapping("/api/auth/admin/users/{id}")
    Map<String, Object> get(@PathVariable("id") Long id);

    @PutMapping("/api/auth/admin/users/{id}")
    ResponseEntity<Void> update(@PathVariable("id") Long id, @RequestBody Map<String, Object> body);

    @PatchMapping("/api/auth/admin/users/{id}/lock")
    ResponseEntity<Void> lock(@PathVariable("id") Long id, @RequestBody Map<String, Object> body);

    @PatchMapping("/api/auth/admin/users/{id}/role")
    ResponseEntity<Void> role(@PathVariable("id") Long id, @RequestBody Map<String, String> body);

    @DeleteMapping("/api/auth/admin/users/{id}")
    ResponseEntity<Void> delete(@PathVariable("id") Long id);
}


