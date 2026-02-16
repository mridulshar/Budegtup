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
@Document(collection = "goals")
public class Goal {

    @Id
    private String id;

    private String userId;

    private String name;

    private String description;

    private Double targetAmount;

    private Double currentAmount;

    private String category;

    private String status; // "ACTIVE", "ACHIEVED", "CANCELLED"

    private LocalDate deadline;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}