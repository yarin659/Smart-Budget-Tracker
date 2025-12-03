package com.yarin.sbt.service;

import com.yarin.sbt.model.User;
import com.yarin.sbt.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    // -----------------------
    // Register (Signup)
    // -----------------------
    public User register(User u) {

        if (repo.existsByEmail(u.getEmail())) {
            throw new RuntimeException("Email already taken");
        }

        u.setPassword(encoder.encode(u.getPassword()));
        return repo.save(u);
    }

    // -----------------------
    // Login
    // -----------------------
    public User login(String email, String rawPassword) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        return user;
    }
}
