package com.budgetup.service;

import com.budgetup.model.User;
import com.budgetup.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Map<String, Object> getOnboardingStatus(String userId) {
        User user = getUserById(userId);
        boolean needsOnboarding = user.getIsOnboarded() == null || !user.getIsOnboarded();
        return Map.of("needsOnboarding", needsOnboarding, "isOnboarded", !needsOnboarding);
    }

    @SuppressWarnings("unchecked")
    public User completeOnboarding(String userId, Map<String, Object> onboardingData) {
        User user = getUserById(userId);

        if (onboardingData.containsKey("fullName")) {
            user.setFullName((String) onboardingData.get("fullName"));
            user.setName((String) onboardingData.get("fullName"));
        }
        if (onboardingData.containsKey("country")) {
            user.setCountry((String) onboardingData.get("country"));
        }
        if (onboardingData.containsKey("flag")) {
            user.setFlag((String) onboardingData.get("flag"));
        }
        if (onboardingData.containsKey("currency")) {
            user.setCurrency((String) onboardingData.get("currency"));
        }
        if (onboardingData.containsKey("occupation")) {
            user.setOccupation((String) onboardingData.get("occupation"));
        }
        if (onboardingData.containsKey("monthlyIncome")) {
            Object income = onboardingData.get("monthlyIncome");
            user.setMonthlyIncome(income instanceof Number ? ((Number) income).doubleValue() : 0.0);
        }
        if (onboardingData.containsKey("pocketMoney")) {
            Object pocket = onboardingData.get("pocketMoney");
            user.setPocketMoney(pocket instanceof Number ? ((Number) pocket).doubleValue() : 0.0);
        }
        if (onboardingData.containsKey("incomeFrequency")) {
            user.setIncomeFrequency((String) onboardingData.get("incomeFrequency"));
        }
        if (onboardingData.containsKey("financialGoals")) {
            user.setFinancialGoals((List<String>) onboardingData.get("financialGoals"));
        }

        user.setIsOnboarded(true);
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public User updateFinancialSettings(String userId, Map<String, Object> settings) {
        User user = getUserById(userId);

        if (settings.containsKey("monthlyIncome")) {
            Object income = settings.get("monthlyIncome");
            user.setMonthlyIncome(income instanceof Number ? ((Number) income).doubleValue() : 0.0);
        }
        if (settings.containsKey("pocketMoney")) {
            Object pocket = settings.get("pocketMoney");
            user.setPocketMoney(pocket instanceof Number ? ((Number) pocket).doubleValue() : 0.0);
        }
        if (settings.containsKey("incomeFrequency")) {
            user.setIncomeFrequency((String) settings.get("incomeFrequency"));
        }

        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User getProfile(String userId) {
        return getUserById(userId);
    }

    public User updateProfile(String userId, Map<String, Object> profileData) {
        User user = getUserById(userId);

        if (profileData.containsKey("displayName")) {
            user.setName((String) profileData.get("displayName"));
            user.setFullName((String) profileData.get("displayName"));
        }
        if (profileData.containsKey("firstName") && profileData.containsKey("lastName")) {
            String fullName = profileData.get("firstName") + " " + profileData.get("lastName");
            user.setFullName(fullName.trim());
        }

        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public void changePassword(String userId, String oldPassword, String newPassword) {
        User user = getUserById(userId);

        if (user.getPassword() != null && !passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setIsPasswordSet(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public void setPassword(String userId, String password) {
        User user = getUserById(userId);
        user.setPassword(passwordEncoder.encode(password));
        user.setIsPasswordSet(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }
}
