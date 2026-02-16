package com.budgetup.controller;

import com.budgetup.model.User;
import com.budgetup.payload.response.AuthResponse;
import com.budgetup.service.GoogleTokenVerifierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class GoogleAuthController {

    @Autowired
    private GoogleTokenVerifierService googleTokenVerifierService;

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");

        if (idToken == null || idToken.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "ID token is required");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            User user = googleTokenVerifierService.verifyAndGetUser(idToken);
            String jwtToken = googleTokenVerifierService.generateToken(user);

            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getIsOnboarded()
            );

            AuthResponse response = new AuthResponse(
                    "Google auth successful!",
                    jwtToken,
                    userInfo
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }
}
