package com.budgetup.service;

import com.budgetup.model.User;
import com.budgetup.model.enums.AuthProvider;
import com.budgetup.payload.request.LoginRequest;
import com.budgetup.payload.request.SignupRequest;
import com.budgetup.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public User signup(@Valid SignupRequest signupRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email is already registered!");
        }

        // Create new user
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setName(signupRequest.getName());
        user.setFullName(signupRequest.getName());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setIsOnboarded(false);
        user.setIsPasswordSet(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public User login(@Valid LoginRequest loginRequest) {
        // Find user by email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Verify password
        if (user.getPassword() == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }

    public String generateToken(User user) {
        return jwtService.generateToken(user.getId(), user.getEmail());
    }
}