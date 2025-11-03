package com.luv2code.authservice.service;

import com.luv2code.authservice.model.User;
import com.luv2code.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    public List<User> listAllUsers() {
        log.info("Fetching all users");
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        log.info("Fetching user with id: {}", id);
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    @Transactional
    public void updateUser(Long id, String fullName, String role, boolean enabled, boolean locked) {
        log.info("Updating user with id: {}", id);
        User user = getUserById(id);
        if (fullName == null || fullName.isBlank()) {
            throw new IllegalArgumentException("Full name cannot be empty");
        }

        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Role cannot be empty");
        }

        try {
            User.Role roleEnum = User.Role.valueOf(role.toUpperCase());
            user.setFullName(fullName.trim());
            user.setRole(roleEnum);
            user.setEnabled(enabled);
            user.setAccountNonLocked(!locked);

            userRepository.save(user);
            log.info("User {} updated successfully", id);

        } catch (IllegalArgumentException e) {
            log.error("Invalid role: {}", role);
            throw new IllegalArgumentException("Invalid role: " + role + ". Must be USER or ADMIN");
        }
    }

    @Transactional
    public void lockUser(Long id, boolean locked) {
        log.info("{} user with id: {}", locked ? "Locking" : "Unlocking", id);

        User user = getUserById(id);
        user.setAccountNonLocked(!locked);

        userRepository.save(user);
        log.info("User {} {} successfully", id, locked ? "locked" : "unlocked");
    }

    @Transactional
    public void changeRole(Long id, String role) {
        log.info("Changing role for user {} to {}", id, role);

        User user = getUserById(id);

        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Role cannot be empty");
        }

        try {
            User.Role roleEnum = User.Role.valueOf(role.toUpperCase());
            user.setRole(roleEnum);
            userRepository.save(user);
            log.info("Role changed successfully for user {}", id);
        } catch (IllegalArgumentException e) {
            log.error("Invalid role: {}", role);
            throw new IllegalArgumentException("Invalid role: " + role + ". Must be USER or ADMIN");
        }
    }

    @Transactional
    public void deleteUser(Long id) {
        log.info("Deleting user with id: {}", id);

        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }

        userRepository.deleteById(id);
        log.info("User {} deleted successfully", id);
    }
}

