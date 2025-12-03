package com.yarin.sbt.controller;

import com.yarin.sbt.model.Transaction;
import com.yarin.sbt.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/insights")
@CrossOrigin("*")
public class InsightsController {

    private final TransactionService service;

    public InsightsController(TransactionService service) {
        this.service = service;
    }

    private Long uid(HttpServletRequest req) {
        return (Long) req.getAttribute("userId");
    }

    @GetMapping("/categories")
    public Map<String, Double> categoryTotals(HttpServletRequest req) {
        List<Transaction> t = service.all(uid(req));

        return t.stream()
                .filter(x -> "expense".equals(x.getType()))
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.summingDouble(Transaction::getAmount)
                ));
    }

    @GetMapping("/monthly")
    public Map<String, Object> monthSummary(HttpServletRequest req) {
        List<Transaction> t = service.all(uid(req));

        double income = t.stream()
                .filter(x -> "income".equals(x.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double expenses = t.stream()
                .filter(x -> "expense".equals(x.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double balance = income - expenses;

        return Map.of(
                "income", income,
                "expenses", expenses,
                "balance", balance
        );
    }
}
