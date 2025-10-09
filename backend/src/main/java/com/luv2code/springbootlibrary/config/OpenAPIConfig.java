package com.luv2code.springbootlibrary.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Spring Boot Library API")
                        .version("1.0")
                        .description("API documentation for Spring Boot Library project")
                        .contact(new Contact()
                                .name("SmartDev Team")
                                .email("support@smartdev.com")));
    }
}
