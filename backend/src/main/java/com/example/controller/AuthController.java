package com.example.controller;

import com.example.entity.User;
import com.example.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
	    origins = "http://localhost:5175",
	    allowCredentials = "true"
	)
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public Object me(
            @AuthenticationPrincipal OAuth2User oauthUser) {

        if (oauthUser == null) {
            return Map.of(
                "authenticated", false
            );
        }

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String googleId = oauthUser.getAttribute("sub");

        User user = userRepository
                .findByEmail(email)
                .orElseGet(() -> {

                    User newUser = new User();

                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setGoogleId(googleId);
                    newUser.setRole(User.Role.CUSTOMER);

                    return userRepository.save(newUser);
                });

        return Map.of(
            "authenticated", true,
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "role", user.getRole().name()
        );
    }
}