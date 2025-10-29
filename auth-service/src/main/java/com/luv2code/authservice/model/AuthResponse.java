package com.luv2code.authservice.model;

public record AuthResponse(
    String token,
    Long userId,
    String email,
    String fullName,
    String role
) {}