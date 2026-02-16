package com.budgetup.service;

import com.budgetup.model.Goal;
import com.budgetup.payload.request.GoalRequest;
import com.budgetup.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    public List<Goal> getAllGoals(String userId) {
        return goalRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Goal getGoalById(String userId, String id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        return goal;
    }

    public Goal createGoal(String userId, GoalRequest request) {
        Goal goal = new Goal();
        goal.setUserId(userId);
        goal.setName(request.getName());
        goal.setDescription(request.getDescription());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setCurrentAmount(request.getCurrentAmount() != null ? request.getCurrentAmount() : 0.0);
        goal.setCategory(request.getCategory());
        goal.setStatus("ACTIVE");

        if (request.getDeadline() != null && !request.getDeadline().isEmpty()) {
            goal.setDeadline(LocalDate.parse(request.getDeadline()));
        }

        goal.setCreatedAt(LocalDateTime.now());
        goal.setUpdatedAt(LocalDateTime.now());

        return goalRepository.save(goal);
    }

    public Goal updateGoal(String userId, String id, GoalRequest request) {
        Goal goal = getGoalById(userId, id);

        if (request.getName() != null) goal.setName(request.getName());
        if (request.getDescription() != null) goal.setDescription(request.getDescription());
        if (request.getTargetAmount() != null) goal.setTargetAmount(request.getTargetAmount());
        if (request.getCurrentAmount() != null) goal.setCurrentAmount(request.getCurrentAmount());
        if (request.getCategory() != null) goal.setCategory(request.getCategory());
        if (request.getDeadline() != null && !request.getDeadline().isEmpty()) {
            goal.setDeadline(LocalDate.parse(request.getDeadline()));
        }

        // Auto-achieve if target met
        if (goal.getCurrentAmount() >= goal.getTargetAmount()) {
            goal.setStatus("ACHIEVED");
        }

        goal.setUpdatedAt(LocalDateTime.now());
        return goalRepository.save(goal);
    }

    public Goal addContribution(String userId, String id, Double amount) {
        Goal goal = getGoalById(userId, id);

        goal.setCurrentAmount(goal.getCurrentAmount() + amount);

        // Auto-achieve if target met
        if (goal.getCurrentAmount() >= goal.getTargetAmount()) {
            goal.setStatus("ACHIEVED");
        }

        goal.setUpdatedAt(LocalDateTime.now());
        return goalRepository.save(goal);
    }

    public void deleteGoal(String userId, String id) {
        Goal goal = getGoalById(userId, id);
        goalRepository.deleteById(goal.getId());
    }

    public Map<String, Object> getGoalProgress(String userId, String id) {
        Goal goal = getGoalById(userId, id);
        double progress = goal.getTargetAmount() > 0
                ? (goal.getCurrentAmount() / goal.getTargetAmount()) * 100
                : 0;

        return Map.of(
                "goal", goal,
                "progress", Math.min(progress, 100),
                "remaining", Math.max(goal.getTargetAmount() - goal.getCurrentAmount(), 0)
        );
    }
}
