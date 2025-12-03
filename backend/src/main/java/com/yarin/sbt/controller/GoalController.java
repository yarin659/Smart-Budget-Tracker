package com.yarin.sbt.controller;

import com.yarin.sbt.model.Goal;
import com.yarin.sbt.service.GoalService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalController {

    private final GoalService service;

    public GoalController(GoalService service) {
        this.service = service;
    }

    private Long uid(HttpServletRequest req) {
        return (Long) req.getAttribute("userId");
    }

    @GetMapping
    public List<Goal> getAll(HttpServletRequest req) {
        return service.all(uid(req));
    }

    @PostMapping
    public Goal create(@RequestBody Goal goal, HttpServletRequest req) {
        return service.add(goal, uid(req));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id, HttpServletRequest req) {
        service.delete(id, uid(req));
    }

    @PutMapping("/{id}")
    public Goal update(@PathVariable("id") Long id, @RequestBody Goal g, HttpServletRequest req) {
        return service.update(id, g, uid(req));
    }


}
