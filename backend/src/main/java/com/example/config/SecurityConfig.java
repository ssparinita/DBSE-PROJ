package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> {})

            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",
                    "/api/products/**",
                    "/api/categories/**",
                    "/api/algorand/**",
                    "/oauth2/**",
                    "/login/**"
                ).permitAll()

                .anyRequest().authenticated()
            )

            .oauth2Login(oauth -> oauth
                .defaultSuccessUrl(
                    "http://localhost:5175/",
                    true
                )
            )

            .logout(logout -> logout
                .logoutSuccessUrl(
                    "http://localhost:5175/"
                )
            );

        return http.build();
    }
}