package com.yarin.sbt.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private LocalDate date;

    @NotNull
    private BigDecimal amount; // positive for income, negative for expense

    @NotBlank
    private String title;

    @Enumerated(EnumType.STRING)
    private Category category = Category.OTHER;

    private String notes;
}
