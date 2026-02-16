package com.budgetup.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;

    private String userId;

    private String type; // "income" or "expense"

    private Double amount;

    private String category;

    private String merchant;

    private String description;

    private LocalDate date;

    private Boolean isRecurring;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
