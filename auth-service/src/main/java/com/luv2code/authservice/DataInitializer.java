package com.luv2code.authservice;

import com.luv2code.authservice.model.User;
import com.luv2code.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin demo
        if (!userRepository.existsByEmail("admin@cfc.com")) {
            User admin = new User();
            admin.setEmail("admin@cfc.com");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setFullName("Admin User");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Created admin user: admin@cfc.com / 123456");
        }

        // Create user demo
        if (!userRepository.existsByEmail("user@cfc.com")) {
            User user = new User();
            user.setEmail("user@cfc.com");
            user.setPassword(passwordEncoder.encode("123456"));
            user.setFullName("Demo User");
            user.setRole(User.Role.USER);
            userRepository.save(user);
            System.out.println("Created demo user: user@cfc.com / 123456");
        }
    }
}
