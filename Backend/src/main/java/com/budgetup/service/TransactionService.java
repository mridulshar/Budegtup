package com.budgetup.service;

import com.budgetup.model.Transaction;
import com.budgetup.payload.request.TransactionRequest;
import com.budgetup.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getAllTransactions(String userId) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId);
    }

    public List<Transaction> getTransactionsByDateRange(String userId, LocalDate start, LocalDate end) {
        return transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, start, end);
    }

    public Transaction createTransaction(String userId, TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setMerchant(request.getMerchant());
        transaction.setDescription(request.getDescription());
        transaction.setDate(LocalDate.parse(request.getDate()));
        transaction.setIsRecurring(request.getIsRecurring() != null ? request.getIsRecurring() : false);
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(String userId, String id, TransactionRequest request) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (request.getType() != null) transaction.setType(request.getType());
        if (request.getAmount() != null) transaction.setAmount(request.getAmount());
        if (request.getCategory() != null) transaction.setCategory(request.getCategory());
        if (request.getMerchant() != null) transaction.setMerchant(request.getMerchant());
        if (request.getDescription() != null) transaction.setDescription(request.getDescription());
        if (request.getDate() != null) transaction.setDate(LocalDate.parse(request.getDate()));
        if (request.getIsRecurring() != null) transaction.setIsRecurring(request.getIsRecurring());
        transaction.setUpdatedAt(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(String userId, String id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        transactionRepository.deleteById(id);
    }
}
