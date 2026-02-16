package com.budgetup.model;

import com.budgetup.model.enums.AuthProvider;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String name;

    private String profilePicture;

    private AuthProvider authProvider;

    private Boolean isOnboarded;

    private Boolean isPasswordSet;

    // Onboarding fields
    private String fullName;
    private String country;
    private String flag;
    private String currency;
    private String occupation;
    private Double monthlyIncome;
    private Double pocketMoney;
    private String incomeFrequency;
    private List<String> financialGoals;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
