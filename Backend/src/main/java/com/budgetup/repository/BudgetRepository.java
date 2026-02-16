package com.budgetup.repository;

import com.budgetup.model.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetRepository extends MongoRepository<Budget, String> {
    List<Budget> findByUserId(String userId);
    List<Budget> findByUserIdAndMonthAndYear(String userId, Integer month, Integer year);
}
