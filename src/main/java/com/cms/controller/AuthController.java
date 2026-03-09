package com.cms.controller;

import com.cms.dto.*;
import com.cms.model.User;
import com.cms.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(
            ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(
            @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.ok(
            ApiResponse.success(user, "Registration successful"));
    }
}