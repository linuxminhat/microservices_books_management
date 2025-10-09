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

                // Disable Cross-Site Request Forgery (for APIs)
                http.csrf(csrf -> csrf.disable());

                // Secure specific endpoints
                http.authorizeHttpRequests(auth -> auth
                                .requestMatchers(
                                                "/api/books/secure/**",
                                                "/api/reviews/secure/**",
                                                "/api/messages/secure/**",
                                                "/api/admin/secure/**")
                                .authenticated()
                                .anyRequest().permitAll() // allow all other requests
                );

                // Enable JWT resource server
                // http.oauth2ResourceServer(oauth2 -> oauth2.jwt());

                // Add CORS
                http.cors(cors -> {
                });

                // Add content negotiation
                http.setSharedObject(ContentNegotiationStrategy.class,
                                new HeaderContentNegotiationStrategy());

                // // Friendly 401 response for Okta
                // Okta.configureResourceServer401ResponseBody(http);

                return http.build();
        }
}
