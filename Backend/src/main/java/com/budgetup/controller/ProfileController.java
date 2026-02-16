package com.budgetup.controller;

import com.budgetup.model.User;
import com.budgetup.security.CustomUserDetails;
import com.budgetup.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    /**
     * Get user profile
     */
    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String userId = getUserId(authentication);
        User user = userService.getProfile(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("data", profileToMap(user));
        return ResponseEntity.ok(response);
    }

    /**
     * Update profile
     */
    @PutMapping
    public ResponseEntity<?> updateProfile(Authentication authentication,
                                            @RequestBody Map<String, Object> profileData) {
        String userId = getUserId(authentication);
        User user = userService.updateProfile(userId, profileData);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile updated!");
        response.put("data", profileToMap(user));
        return ResponseEntity.ok(response);
    }

    /**
     * Change password
     */
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(Authentication authentication,
                                             @RequestBody Map<String, String> passwordData) {
        String userId = getUserId(authentication);
        userService.changePassword(userId, passwordData.get("oldPassword"), passwordData.get("newPassword"));

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully!");
        return ResponseEntity.ok(response);
    }

    /**
     * Set password (for Google OAuth users)
     */
    @PostMapping("/set-password")
    public ResponseEntity<?> setPassword(Authentication authentication,
                                          @RequestBody Map<String, String> data) {
        String userId = getUserId(authentication);
        userService.setPassword(userId, data.get("password"));

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password set successfully!");
        return ResponseEntity.ok(response);
    }

    private String getUserId(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }

    private Map<String, Object> profileToMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("email", user.getEmail());
        map.put("name", user.getName());
        map.put("fullName", user.getFullName());
        map.put("displayName", user.getName());
        map.put("firstName", user.getFullName() != null && user.getFullName().contains(" ")
                ? user.getFullName().split(" ")[0] : user.getName());
        map.put("lastName", user.getFullName() != null && user.getFullName().contains(" ")
                ? user.getFullName().substring(user.getFullName().indexOf(" ") + 1) : "");
        map.put("profilePicUrl", user.getProfilePicture());
        map.put("authProvider", user.getAuthProvider() != null ? user.getAuthProvider().name().toLowerCase() : "local");
        map.put("hasSetPassword", user.getIsPasswordSet() != null ? user.getIsPasswordSet() : false);
        map.put("country", user.getCountry());
        map.put("flag", user.getFlag());
        map.put("currency", user.getCurrency());
        map.put("occupation", user.getOccupation());
        map.put("monthlyIncome", user.getMonthlyIncome());
        map.put("pocketMoney", user.getPocketMoney());
        map.put("incomeFrequency", user.getIncomeFrequency());
        map.put("financialGoals", user.getFinancialGoals());
        map.put("isOnboarded", user.getIsOnboarded());
        return map;
    }
}
