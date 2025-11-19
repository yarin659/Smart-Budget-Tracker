package com.yarin.sbt.controller;

import com.yarin.sbt.dto.TransactionDTO;
import com.yarin.sbt.model.Transaction;
import com.yarin.sbt.model.Category;
import com.yarin.sbt.repository.TransactionRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    private final TransactionRepository repo;
    public TransactionController(TransactionRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Transaction> all() { return repo.findAll(); }

    @PostMapping
    public Transaction create(@Valid @RequestBody TransactionDTO dto) {
        Transaction t = Transaction.builder()
                .date(dto.date())
                .amount(dto.amount())
                .title(dto.title())
                .category(dto.category() == null ? Category.OTHER : dto.category())
                .notes(dto.notes())
                .build();
        return repo.save(t);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
