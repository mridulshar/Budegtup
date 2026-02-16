package com.budgetup.repository;

import com.budgetup.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByUserIdOrderByDateDesc(String userId);
    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(String userId, LocalDate start, LocalDate end);
    List<Transaction> findByUserIdAndType(String userId, String type);
    List<Transaction> findByUserIdAndCategory(String userId, String category);
}
