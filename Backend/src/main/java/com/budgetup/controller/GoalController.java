package com.budgetup.controller;

import com.budgetup.model.Goal;
import com.budgetup.payload.request.GoalRequest;
import com.budgetup.security.CustomUserDetails;
import com.budgetup.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @GetMapping
    public ResponseEntity<?> getAllGoals(Authentication authentication) {
        String userId = getUserId(authentication);
        List<Goal> goals = goalService.getAllGoals(userId);

        List<Map<String, Object>> result = goals.stream()
                .map(this::goalToMap)
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGoal(Authentication authentication, @PathVariable String id) {
        String userId = getUserId(authentication);
        Goal goal = goalService.getGoalById(userId, id);
        return ResponseEntity.ok(goalToMap(goal));
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<?> getGoalProgress(Authentication authentication, @PathVariable String id) {
        String userId = getUserId(authentication);
        Map<String, Object> progress = goalService.getGoalProgress(userId, id);
        return ResponseEntity.ok(progress);
    }

    @PostMapping
    public ResponseEntity<?> createGoal(Authentication authentication,
                                         @Valid @RequestBody GoalRequest request) {
        String userId = getUserId(authentication);
        Goal goal = goalService.createGoal(userId, request);
        return ResponseEntity.ok(goalToMap(goal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGoal(Authentication authentication,
                                         @PathVariable String id,
                                         @RequestBody GoalRequest request) {
        String userId = getUserId(authentication);
        Goal goal = goalService.updateGoal(userId, id, request);
        return ResponseEntity.ok(goalToMap(goal));
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<?> addContribution(Authentication authentication,
                                              @PathVariable String id,
                                              @RequestBody Map<String, Double> body) {
        String userId = getUserId(authentication);
        Goal goal = goalService.addContribution(userId, id, body.get("amount"));
        return ResponseEntity.ok(goalToMap(goal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(Authentication authentication, @PathVariable String id) {
        String userId = getUserId(authentication);
        goalService.deleteGoal(userId, id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Goal deleted successfully");
        return ResponseEntity.ok(response);
    }

    private String getUserId(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }

    private Map<String, Object> goalToMap(Goal g) {
        Map<String, Object> map = new HashMap<>();
        map.put("_id", g.getId());
        map.put("id", g.getId());
        map.put("userId", g.getUserId());
        map.put("name", g.getName());
        map.put("description", g.getDescription());
        map.put("targetAmount", g.getTargetAmount());
        map.put("currentAmount", g.getCurrentAmount());
        map.put("category", g.getCategory());
        map.put("status", g.getStatus());
        map.put("deadline", g.getDeadline() != null ? g.getDeadline().toString() : null);
        map.put("createdAt", g.getCreatedAt() != null ? g.getCreatedAt().toString() : null);
        return map;
    }
}
