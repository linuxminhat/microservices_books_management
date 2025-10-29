package com.luv2code.authservice.utils;

import com.luv2code.authservice.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExtractJWT {
    private final JwtUtil jwtUtil;

    public Long getUserIdFromJWT(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            try {
                return jwtUtil.extractUserId(jwt);
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    public String getEmailFromJWT(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            try {
                return jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    public String getRoleFromJWT(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            try {
                return jwtUtil.extractRole(jwt);
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }
}
