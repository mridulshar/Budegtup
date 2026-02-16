package com.budgetup.controller;

import com.budgetup.security.CustomUserDetails;
import com.budgetup.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/overview")
    public ResponseEntity<?> getOverview(Authentication authentication,
                                          @RequestParam(defaultValue = "month") String period) {
        String userId = getUserId(authentication);
        Map<String, Object> overview = analyticsService.getOverview(userId, period);
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/spending-trends")
    public ResponseEntity<?> getSpendingTrends(Authentication authentication,
                                                @RequestParam(defaultValue = "6") int months) {
        String userId = getUserId(authentication);
        List<Map<String, Object>> trends = analyticsService.getSpendingTrends(userId, months);
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/category-insights")
    public ResponseEntity<?> getCategoryInsights(Authentication authentication,
                                                  @RequestParam(defaultValue = "month") String period) {
        String userId = getUserId(authentication);
        List<Map<String, Object>> insights = analyticsService.getCategoryInsights(userId, period);
        return ResponseEntity.ok(insights);
    }

    private String getUserId(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }
}
