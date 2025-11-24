package com.yarin.sbt.service;

import com.yarin.sbt.model.Transaction;
import com.yarin.sbt.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository repo;

    public TransactionService(TransactionRepository repo) {
        this.repo = repo;
    }

    public List<Transaction> all() {
        return repo.findAll();
    }

    public Transaction add(Transaction t) {
        return repo.save(t);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
