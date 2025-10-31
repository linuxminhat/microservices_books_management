package com.luv2code.adminservice.controller;

import com.luv2code.adminservice.client.AuthUserClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminController {

    private final AuthUserClient authUserClient;

    @GetMapping
    public List<Map<String, Object>> list(@RequestHeader("Authorization") String authorization) {
        return authUserClient.list();
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@RequestHeader("Authorization") String authorization,
            @PathVariable Long id) {
        return authUserClient.get(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@RequestHeader("Authorization") String authorization,
            @PathVariable Long id, @RequestBody Map<String, Object> body) {
        return authUserClient.update(id, body);
    }

    @PatchMapping("/{id}/lock")
    public ResponseEntity<Void> lock(@RequestHeader("Authorization") String authorization,
            @PathVariable Long id, @RequestBody Map<String, Object> body) {
        return authUserClient.lock(id, body);
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<Void> role(@RequestHeader("Authorization") String authorization,
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        return authUserClient.role(id, body);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader("Authorization") String authorization,
            @PathVariable Long id) {
        return authUserClient.delete(id);
    }
}
