package com.yarin.sbt.dto;

import com.yarin.sbt.model.Category;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionDTO(
        @NotNull LocalDate date,
        @NotNull BigDecimal amount,
        @NotBlank String title,
        Category category,
        String notes
) {}
