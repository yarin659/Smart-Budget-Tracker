package com.yarin.sbt.controller;

import com.yarin.sbt.model.User;
import com.yarin.sbt.repository.UserRepository;
import com.yarin.sbt.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthController(UserRepository repo, PasswordEncoder encoder, JwtUtil jwt) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/signup")
    public Map<String, String> signup(@RequestBody User user) {
        if (repo.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);

        return Map.of("status", "OK");
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        User dbUser = repo.findByUsername(user.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(user.getPassword(), dbUser.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwt.generateToken(dbUser.getId());

        return Map.of(
                "token", token,
                "id", dbUser.getId(),
                "username", dbUser.getUsername(),
                "email", dbUser.getEmail()
        );
    }
}
