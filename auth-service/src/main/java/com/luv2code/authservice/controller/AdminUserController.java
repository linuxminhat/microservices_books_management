package com.luv2code.authservice.controller;

import com.luv2code.authservice.model.User;
import com.luv2code.authservice.service.AdminUserService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<User>> list() {
        try {
            List<User> users = adminUserService.listAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Error fetching users", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> get(@PathVariable Long id) {
        try {
            User user = adminUserService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            log.warn("User not found with id: {}", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error fetching user with id: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    public record UpdateUserRequest(@NotBlank String fullName, @NotBlank String role,
            boolean enabled, boolean locked) {
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateUserRequest req) {
        try {
            adminUserService.updateUser(id, req.fullName(), req.role(), req.enabled(), req.locked());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for user id {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error updating user with id: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/{id}/lock")
    public ResponseEntity<?> lock(@PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        try {
            boolean locked = Boolean.TRUE.equals(body.get("locked"));
            adminUserService.lockUser(id, locked);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("User not found with id: {}", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error locking/unlocking user with id: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<?> changeRole(@PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String role = body.get("role");
            adminUserService.changeRole(id, role);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("Invalid role change for user id {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error changing role for user with id: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            adminUserService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("User not found with id: {}", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting user with id: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}


