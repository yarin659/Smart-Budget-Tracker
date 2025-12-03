package com.yarin.sbt.controller;

import com.yarin.sbt.model.Transaction;
import com.yarin.sbt.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    private final TransactionService service;

    public DashboardController(TransactionService service) {
        this.service = service;
    }

    private Long uid(HttpServletRequest req) {
        return (Long) req.getAttribute("userId");
    }

    @GetMapping
    public Map<String, Object> getSummary(HttpServletRequest req) {

        List<Transaction> t = service.all(uid(req));

        double income = t.stream()
                .filter(x -> "income".equals(x.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double expenses = t.stream()
                .filter(x -> "expense".equals(x.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        return Map.of(
                "income", income,
                "expenses", expenses,
                "balance", income - expenses,
                "transactions", t
        );
    }
}
