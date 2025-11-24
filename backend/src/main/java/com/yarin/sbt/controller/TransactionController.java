package com.yarin.sbt.controller;

import com.yarin.sbt.model.Transaction;
import com.yarin.sbt.service.TransactionService;
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

    @GetMapping
    public List<Transaction> getAll() {
        return service.all();
    }

    @PostMapping
    public Transaction create(@RequestBody Transaction t) {
        return service.add(t);
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        service.delete(id);
    }
}
