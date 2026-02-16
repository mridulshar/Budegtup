package com.budgetup.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "budgets")
public class Budget {

    @Id
    private String id;

    private String userId;

    private String category;

    private Double limit;

    private Double spent;

    private Integer month;

    private Integer year;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
