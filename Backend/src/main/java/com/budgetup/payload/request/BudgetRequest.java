package com.budgetup.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class BudgetRequest {

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Limit is required")
    @Positive(message = "Limit must be positive")
    private Double limit;

    private Integer month;
    private Integer year;

    public BudgetRequest() {}

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getLimit() { return limit; }
    public void setLimit(Double limit) { this.limit = limit; }

    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
}
