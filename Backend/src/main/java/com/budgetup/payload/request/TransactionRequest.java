package com.budgetup.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class TransactionRequest {

    @NotBlank(message = "Type is required")
    private String type;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Merchant is required")
    private String merchant;

    private String description;

    @NotBlank(message = "Date is required")
    private String date;

    private Boolean isRecurring;

    // Constructors
    public TransactionRequest() {}

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMerchant() { return merchant; }
    public void setMerchant(String merchant) { this.merchant = merchant; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Boolean getIsRecurring() { return isRecurring; }
    public void setIsRecurring(Boolean isRecurring) { this.isRecurring = isRecurring; }
}
