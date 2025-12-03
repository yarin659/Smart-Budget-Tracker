package com.yarin.sbt.service;

import com.yarin.sbt.model.User;
import com.yarin.sbt.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repo;
    private final BCryptPasswordEncoder encoder;

    public UserService(UserRepository repo, BCryptPasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public User register(User u) {

        if (repo.existsByUsername(u.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        u.setPassword(encoder.encode(u.getPassword()));
        return repo.save(u);
    }

    public User login(String username, String rawPassword) {
        User user = repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        return user;
    }
}
