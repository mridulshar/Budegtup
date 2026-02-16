package com.budgetup.controller;

import com.budgetup.model.User;
import com.budgetup.payload.request.LoginRequest;
import com.budgetup.payload.request.SignupRequest;
import com.budgetup.payload.response.AuthResponse;
import com.budgetup.service.AuthService;
import com.budgetup.service.GoogleTokenVerifierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired(required = false)
    private GoogleTokenVerifierService googleTokenVerifierService;

    /**
     * SIGNUP ENDPOINT
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        System.out.println("=== AuthController: Received signup request ===");
        System.out.println("Email: " + signupRequest.getEmail());
        System.out.println("Name: " + signupRequest.getName());

        try {
            User savedUser = authService.signup(signupRequest);

            // Generate real JWT token
            String jwtToken = authService.generateToken(savedUser);

            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                    savedUser.getId(),
                    savedUser.getEmail(),
                    savedUser.getName(),
                    savedUser.getIsOnboarded()
            );

            AuthResponse response = new AuthResponse(
                    "User registered successfully!",
                    jwtToken,
                    userInfo
            );

            System.out.println("=== AuthController: Signup success ===");
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.out.println("=== AuthController: Error - " + e.getMessage() + " ===");
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * LOGIN ENDPOINT
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("=== AuthController: Received login request ===");
        System.out.println("Email: " + loginRequest.getEmail());

        try {
            User user = authService.login(loginRequest);

            // Generate real JWT token
            String jwtToken = authService.generateToken(user);

            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getIsOnboarded()
            );

            AuthResponse response = new AuthResponse(
                    "Login successful!",
                    jwtToken,
                    userInfo
            );

            System.out.println("=== AuthController: Login success ===");
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.out.println("=== AuthController: Error - " + e.getMessage() + " ===");
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }
}