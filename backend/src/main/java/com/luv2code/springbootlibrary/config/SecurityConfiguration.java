package com.luv2code.springbootlibrary.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class SecurityConfiguration {

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http.csrf(csrf -> csrf.disable());

                http.authorizeHttpRequests(auth -> auth
                                .requestMatchers(
                                                "/api/books/secure/**",
                                                "/api/reviews/secure/**",
                                                "/api/messages/secure/**",
                                                "/api/admin/secure/**")
                                .authenticated()
                                .anyRequest().permitAll());

                http.cors(cors -> {
                });

                http.setSharedObject(ContentNegotiationStrategy.class,
                                new HeaderContentNegotiationStrategy());

                return http.build();
        }
}
