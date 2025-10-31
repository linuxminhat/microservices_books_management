package com.luv2code.authservice.controller;

import com.luv2code.authservice.model.User;
import com.luv2code.authservice.repository.UserRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auth/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> list() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> get(@PathVariable Long id) {
        return userRepository.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public record UpdateUserRequest(@NotBlank String fullName, @NotBlank String role,
            boolean enabled, boolean locked) {
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateUserRequest req) {
        return userRepository.findById(id).map(u -> {
            u.setFullName(req.fullName());
            u.setRole(User.Role.valueOf(req.role()));
            u.setEnabled(req.enabled());
            u.setAccountNonLocked(!req.locked());
            userRepository.save(u);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/lock")
    public ResponseEntity<?> lock(@PathVariable Long id,
            @RequestBody java.util.Map<String, Boolean> body) {
        boolean locked = Boolean.TRUE.equals(body.get("locked"));
        return userRepository.findById(id).map(u -> {
            u.setAccountNonLocked(!locked);
            userRepository.save(u);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<?> changeRole(@PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {
        String role = body.get("role");
        return userRepository.findById(id).map(u -> {
            u.setRole(User.Role.valueOf(role));
            userRepository.save(u);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!userRepository.existsById(id))
            return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}


