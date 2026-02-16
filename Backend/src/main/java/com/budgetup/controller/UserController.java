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
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Get onboarding status
     */
    @GetMapping("/onboarding/status")
    public ResponseEntity<?> getOnboardingStatus(Authentication authentication) {
        String userId = getUserId(authentication);
        Map<String, Object> status = userService.getOnboardingStatus(userId);
        return ResponseEntity.ok(status);
    }

    /**
     * Complete onboarding
     */
    @PostMapping("/onboarding")
    public ResponseEntity<?> completeOnboarding(Authentication authentication,
                                                 @RequestBody Map<String, Object> onboardingData) {
        String userId = getUserId(authentication);
        User user = userService.completeOnboarding(userId, onboardingData);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Onboarding completed successfully!");
        response.put("user", userToMap(user));
        return ResponseEntity.ok(response);
    }

    /**
     * Update financial settings
     */
    @PutMapping("/financial-settings")
    public ResponseEntity<?> updateFinancialSettings(Authentication authentication,
                                                      @RequestBody Map<String, Object> settings) {
        String userId = getUserId(authentication);
        User user = userService.updateFinancialSettings(userId, settings);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Financial settings updated!");
        response.put("data", userToMap(user));
        return ResponseEntity.ok(response);
    }

    /**
     * Get user profile (for CurrencyContext)
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        String userId = getUserId(authentication);
        User user = userService.getUserById(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("profile", userToMap(user));
        return ResponseEntity.ok(response);
    }

    private String getUserId(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }

    private Map<String, Object> userToMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("email", user.getEmail());
        map.put("name", user.getName());
        map.put("fullName", user.getFullName());
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
