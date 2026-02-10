package com.yarin.sbt.scheduler;

import com.yarin.sbt.model.Goal;
import com.yarin.sbt.repository.GoalRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class GoalScheduler {

    private final GoalRepository repo;

    public GoalScheduler(GoalRepository repo) {
        this.repo = repo;
    }

    // Every_Midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void applyMonthlyDeposits() {

        LocalDate today = LocalDate.now();
        int todayDay = today.getDayOfMonth();

        List<Goal> goals = repo.findAll();

        for (Goal g : goals) {
            if (g.getMonthlyDay() == null) continue;
            if (g.getMonthlyAmount() == null) continue;
            if (g.getMonthlyAmount() <= 0) continue;


            if (g.getMonthlyDay() == todayDay) {

                double newVal = g.getCurrentAmount() + g.getMonthlyAmount();
                g.setCurrentAmount(newVal);

                repo.save(g);
            }
        }
    }
}
