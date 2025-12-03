package com.yarin.sbt.service;

import com.yarin.sbt.model.Transaction;
import com.yarin.sbt.model.User;
import com.yarin.sbt.repository.TransactionRepository;
import com.yarin.sbt.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository repo;
    private final UserRepository userRepo;

    public TransactionService(TransactionRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    public Transaction add(Transaction t, Long userId) {
        User u = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        t.setUser(u);
        return repo.save(t);
    }

    public List<Transaction> all(Long userId) {
        return repo.findByUserId(userId);
    }

    public Transaction update(Long id, Transaction data, Long userId) {

        Transaction existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // לוודא שזה שייך למשתמש שמבצע את העדכון
        if (!existing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }

        existing.setAmount(data.getAmount());
        existing.setCategory(data.getCategory());
        existing.setDate(data.getDate());
        existing.setDescription(data.getDescription());
        existing.setType(data.getType());

        return repo.save(existing);
    }


    public void delete(Long id, Long userId) {
        Transaction t = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // לוודא שלא מוחקים למישהו אחר את ההוצאה
        if (!t.getUser().getId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }

        repo.delete(t);
    }
}
