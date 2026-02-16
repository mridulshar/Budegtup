package com.budgetup.service;

import com.budgetup.model.User;
import com.budgetup.model.enums.AuthProvider;
import com.budgetup.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

@Service
public class GoogleTokenVerifierService {

    @Value("${google.client.id}")
    private String clientId;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    public User verifyAndGetUser(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String picture = (String) payload.get("picture");

                Optional<User> existingUser = userRepository.findByEmail(email);

                if (existingUser.isPresent()) {
                    // Update existing user
                    User user = existingUser.get();
                    if (picture != null) user.setProfilePicture(picture);
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                } else {
                    // Create new user
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setFullName(name);
                    newUser.setProfilePicture(picture);
                    newUser.setAuthProvider(AuthProvider.GOOGLE);
                    newUser.setIsOnboarded(false);
                    newUser.setIsPasswordSet(false);
                    newUser.setCreatedAt(LocalDateTime.now());
                    newUser.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(newUser);
                }
            }
        } catch (Exception e) {
            System.err.println("Google token verification failed: " + e.getMessage());
        }

        throw new RuntimeException("Invalid Google token");
    }

    public String generateToken(User user) {
        return jwtService.generateToken(user.getId(), user.getEmail());
    }
}
