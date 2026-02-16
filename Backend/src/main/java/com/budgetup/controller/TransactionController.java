package com.budgetup.controller;

import com.budgetup.model.Transaction;
import com.budgetup.payload.request.TransactionRequest;
import com.budgetup.security.CustomUserDetails;
import com.budgetup.service.TransactionService;
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
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    /**
     * Get all transactions
     */
    @GetMapping
    public ResponseEntity<?> getAllTransactions(Authentication authentication) {
        String userId = getUserId(authentication);
        List<Transaction> transactions = transactionService.getAllTransactions(userId);

        // Convert to frontend-compatible format
        List<Map<String, Object>> result = transactions.stream()
                .map(this::transactionToMap)
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    /**
     * Create transaction
     */
    @PostMapping
    public ResponseEntity<?> createTransaction(Authentication authentication,
                                                @Valid @RequestBody TransactionRequest request) {
        String userId = getUserId(authentication);
        Transaction transaction = transactionService.createTransaction(userId, request);
        return ResponseEntity.ok(transactionToMap(transaction));
    }

    /**
     * Update transaction
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(Authentication authentication,
                                                @PathVariable String id,
                                                @RequestBody TransactionRequest request) {
        String userId = getUserId(authentication);
        Transaction transaction = transactionService.updateTransaction(userId, id, request);
        return ResponseEntity.ok(transactionToMap(transaction));
    }

    /**
     * Delete transaction
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(Authentication authentication,
                                                @PathVariable String id) {
        String userId = getUserId(authentication);
        transactionService.deleteTransaction(userId, id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Transaction deleted successfully");
        return ResponseEntity.ok(response);
    }

    private String getUserId(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }

    private Map<String, Object> transactionToMap(Transaction t) {
        Map<String, Object> map = new HashMap<>();
        map.put("_id", t.getId());
        map.put("id", t.getId());
        map.put("userId", t.getUserId());
        map.put("type", t.getType());
        map.put("amount", t.getAmount());
        map.put("category", t.getCategory());
        map.put("merchant", t.getMerchant());
        map.put("description", t.getDescription());
        map.put("date", t.getDate() != null ? t.getDate().toString() : null);
        map.put("isRecurring", t.getIsRecurring());
        map.put("createdAt", t.getCreatedAt() != null ? t.getCreatedAt().toString() : null);
        return map;
    }
}
