package com.budgetup.controller;

import com.budgetup.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/agent")
public class AgentController {

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeFinances(Authentication authentication,
                                              @RequestBody Map<String, String> body) {
        String focusArea = body.getOrDefault("focusArea", "general");

        Map<String, Object> response = new HashMap<>();
        response.put("analysis", "Based on your " + focusArea + " financial data, you're doing well! Consider reviewing your spending categories for optimization opportunities.");
        response.put("focusArea", focusArea);
        response.put("timestamp", new Date().toString());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(Authentication authentication,
                                   @RequestBody Map<String, Object> body) {
        String message = (String) body.getOrDefault("message", "");

        Map<String, Object> response = new HashMap<>();
        response.put("reply", "I'm your BudgetUp financial assistant. I can help you track expenses, set budgets, and achieve your financial goals. How can I help you today?");
        response.put("timestamp", new Date().toString());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/insights")
    public ResponseEntity<?> getInsights(Authentication authentication) {
        List<Map<String, String>> insights = new ArrayList<>();

        insights.add(Map.of(
                "title", "Smart Spending",
                "description", "Track your daily expenses to identify savings opportunities",
                "type", "tip"
        ));

        insights.add(Map.of(
                "title", "Budget Goals",
                "description", "Setting monthly budgets helps you stay on track",
                "type", "info"
        ));

        return ResponseEntity.ok(insights);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(Authentication authentication) {
        List<Map<String, String>> recommendations = new ArrayList<>();

        recommendations.add(Map.of(
                "title", "Emergency Fund",
                "description", "Consider building an emergency fund with 3-6 months of expenses",
                "priority", "high"
        ));

        recommendations.add(Map.of(
                "title", "Review Subscriptions",
                "description", "Check your recurring payments for any unused subscriptions",
                "priority", "medium"
        ));

        return ResponseEntity.ok(recommendations);
    }
}
