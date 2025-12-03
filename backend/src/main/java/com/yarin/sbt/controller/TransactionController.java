package com.yarin.sbt.controller;

import com.yarin.sbt.model.Transaction;
import com.yarin.sbt.security.JwtUtil;
import com.yarin.sbt.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    // מקבל userId מהפילטר — אין יותר userId מהפרונט
    private Long getUserId(HttpServletRequest req) {
        return (Long) req.getAttribute("userId");
    }

    @GetMapping
    public List<Transaction> getAll(HttpServletRequest req) {
        Long userId = getUserId(req);
        return service.all(userId);
    }

    @PostMapping
    public Transaction create(@RequestBody Transaction t, HttpServletRequest req) {
        Long userId = getUserId(req);
        return service.add(t, userId);
    }

    @PutMapping("/{id}")
    public Transaction update(
            @PathVariable("id") Long id,
            @RequestBody Transaction updated,
            HttpServletRequest req
    ) {
        Long userId = getUserId(req);
        return service.update(id, updated, userId);
    }



    @DeleteMapping("/{id}")
    public void remove(@PathVariable("id") Long id, HttpServletRequest req) {
        Long userId = getUserId(req);
        service.delete(id, userId);
    }
}
