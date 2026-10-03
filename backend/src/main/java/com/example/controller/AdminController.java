package com.example.controller;

import com.example.entity.User;
import com.example.entity.Vendor;
import com.example.repository.UserRepository;
import com.example.repository.VendorRepository;

import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(
	    origins = "http://localhost:5175",
	    allowCredentials = "true"
	)
public class AdminController {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;

    public AdminController(
            UserRepository userRepository,
            VendorRepository vendorRepository) {

        this.userRepository = userRepository;
        this.vendorRepository = vendorRepository;
    }

    @GetMapping("/users")
    public List<User> getUsers(
            @AuthenticationPrincipal OAuth2User oauthUser) {

        checkAdmin(oauthUser);

        return userRepository.findAll();
    }

    @PutMapping("/users/{id}/role")
    public User updateRole(
            @PathVariable Long id,
            @RequestParam User.Role role,
            @AuthenticationPrincipal OAuth2User oauthUser) {

        checkAdmin(oauthUser);

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setRole(role);

        User savedUser = userRepository.save(user);

        // Automatically create vendor profile
        if (role == User.Role.VENDOR) {

            if (vendorRepository.findByUserId(user.getId()).isEmpty()) {

                Vendor vendor = new Vendor();

                vendor.setUser(user);
                vendor.setStoreName(
                        user.getName() + "'s Store"
                );
                vendor.setDescription(
                        "GALERIE vendor store"
                );

                vendorRepository.save(vendor);
            }
        }

        return savedUser;
    }

    private void checkAdmin(OAuth2User oauthUser) {

        if (oauthUser == null) {
            throw new RuntimeException("Not authenticated");
        }

        String email = oauthUser.getAttribute("email");

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Admin access required");
        }
    }
}