package com.budgetup.repository;

import com.budgetup.model.Goal;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends MongoRepository<Goal, String> {
    List<Goal> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Goal> findByUserIdAndStatus(String userId, String status);
}
