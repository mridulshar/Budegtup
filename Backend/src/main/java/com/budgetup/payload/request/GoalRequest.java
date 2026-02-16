package com.budgetup.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class GoalRequest {

    @NotBlank(message = "Goal name is required")
    private String name;

    private String description;

    @NotNull(message = "Target amount is required")
    @Positive(message = "Target amount must be positive")
    private Double targetAmount;

    private Double currentAmount;

    private String category;

    private String deadline;

    public GoalRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getTargetAmount() { return targetAmount; }
    public void setTargetAmount(Double targetAmount) { this.targetAmount = targetAmount; }

    public Double getCurrentAmount() { return currentAmount; }
    public void setCurrentAmount(Double currentAmount) { this.currentAmount = currentAmount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }
}
