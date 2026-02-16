package com.budgetup.controller;

import com.budgetup.model.Budget;
import com.budgetup.payload.request.BudgetRequest;
import com.budgetup.security.CustomUserDetails;
import com.budgetup.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public ResponseEntity<?> getAllBudgets(Authentication authentication,
                                           @RequestParam(required = false) Integer month,
                                           @RequestParam(required = false) Integer year) {
        String userId = getUserId(authentication);
        List<Budget> budgets;

        if (month != null && year != null) {
            budgets = budgetService.getBudgetsByMonthYear(userId, month, year);
        } else {
            budgets = budgetService.getAllBudgets(userId);
        }

        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentBudgets(Authentication authentication) {
        String userId = getUserId(authentication);
        List<Budget> budgets = budgetService.getCurrentMonthBudgets(userId);
        return ResponseEntity.ok(budgets);
    }

    @PostMapping
    public ResponseEntity<?> createBudget(Authentication authentication,
                                           @Valid @RequestBody BudgetRequest request) {
        String userId = getUserId(authentication);
        Budget budget = budgetService.createBudget(userId, request);
        return ResponseEntity.ok(budget);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(Authentication authentication,
                                           @PathVariable String id,
                                           @RequestBody BudgetRequest request) {
        String userId = getUserId(authentication);
        Budget budget = budgetService.updateBudget(userId, id, request);
        return ResponseEntity.ok(budget);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(Authentication authentication,
                                           @PathVariable String id) {
        String userId = getUserId(authentication);
        budgetService.deleteBudget(userId, id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Budget deleted successfully");
        return ResponseEntity.ok(response);
    }

    private String getUserId(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }
}
