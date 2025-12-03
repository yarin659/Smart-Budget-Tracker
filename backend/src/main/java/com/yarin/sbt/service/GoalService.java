package com.yarin.sbt.service;

import com.yarin.sbt.model.Goal;
import com.yarin.sbt.model.User;
import com.yarin.sbt.repository.GoalRepository;
import com.yarin.sbt.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {

    private final GoalRepository repo;
    private final UserRepository userRepo;

    public GoalService(GoalRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    public Goal add(Goal g, Long userId) {
        User u = userRepo.findById(userId).orElseThrow();
        g.setUser(u);
        return repo.save(g);
    }

    public List<Goal> all(Long userId) {
        return repo.findByUserId(userId);
    }


    public Goal update(Long id, Goal updates, Long userId) {
        Goal g = repo.findById(id).orElseThrow();

        if (!g.getUser().getId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }

        // Merge values (רק מה שמגיע מהפרונט)
        if (updates.getTitle() != null)
            g.setTitle(updates.getTitle());

        if (updates.getTargetAmount() != null)
            g.setTargetAmount(updates.getTargetAmount());

        if (updates.getDeadline() != null)
            g.setDeadline(updates.getDeadline());

        if (updates.getMonthlyAmount() != null)
            g.setMonthlyAmount(updates.getMonthlyAmount());

        if (updates.getMonthlyDay() != null)
            g.setMonthlyDay(updates.getMonthlyDay());

        if (updates.getCurrentAmount() != null)
            g.setCurrentAmount(updates.getCurrentAmount());

        
        return repo.save(g);
    }


    public void delete(Long id, Long userId) {
        Goal g = repo.findById(id).orElseThrow();
        if (!g.getUser().getId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }
        repo.delete(g);
    }
}
