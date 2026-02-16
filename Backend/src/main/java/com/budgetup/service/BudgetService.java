package com.budgetup.service;

import com.budgetup.model.Budget;
import com.budgetup.payload.request.BudgetRequest;
import com.budgetup.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public List<Budget> getAllBudgets(String userId) {
        return budgetRepository.findByUserId(userId);
    }

    public List<Budget> getBudgetsByMonthYear(String userId, Integer month, Integer year) {
        return budgetRepository.findByUserIdAndMonthAndYear(userId, month, year);
    }

    public List<Budget> getCurrentMonthBudgets(String userId) {
        LocalDate now = LocalDate.now();
        return budgetRepository.findByUserIdAndMonthAndYear(userId, now.getMonthValue(), now.getYear());
    }

    public Budget createBudget(String userId, BudgetRequest request) {
        Budget budget = new Budget();
        budget.setUserId(userId);
        budget.setCategory(request.getCategory());
        budget.setLimit(request.getLimit());
        budget.setSpent(0.0);

        if (request.getMonth() != null && request.getYear() != null) {
            budget.setMonth(request.getMonth());
            budget.setYear(request.getYear());
        } else {
            LocalDate now = LocalDate.now();
            budget.setMonth(now.getMonthValue());
            budget.setYear(now.getYear());
        }

        budget.setCreatedAt(LocalDateTime.now());
        budget.setUpdatedAt(LocalDateTime.now());

        return budgetRepository.save(budget);
    }

    public Budget updateBudget(String userId, String id, BudgetRequest request) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (request.getCategory() != null) budget.setCategory(request.getCategory());
        if (request.getLimit() != null) budget.setLimit(request.getLimit());
        budget.setUpdatedAt(LocalDateTime.now());

        return budgetRepository.save(budget);
    }

    public void deleteBudget(String userId, String id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        budgetRepository.deleteById(id);
    }
}
