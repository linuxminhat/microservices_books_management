package com.luv2code.authservice.service;

import com.luv2code.authservice.model.AuthResponse;
import com.luv2code.authservice.model.LoginRequest;
import com.luv2code.authservice.model.RegisterRequest;
import com.luv2code.authservice.model.User;
import com.luv2code.authservice.repository.UserRepository;
import com.luv2code.authservice.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        String providedName = request.fullName();
        if (providedName == null || providedName.isBlank()) {
            String local = request.email().split("@")[0];
            providedName = local;
        }
        user.setFullName(providedName);
        user.setRole(User.Role.USER);
        
        userRepository.save(user);
    }
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        String token = jwtUtil.generateToken(user);
        
        return new AuthResponse(
            token,
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            user.getRole().name()
        );
    }
    
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}