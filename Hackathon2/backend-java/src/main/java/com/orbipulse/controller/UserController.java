package com.orbipulse.controller;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.orbipulse.model.User;
import com.orbipulse.repository.UserRepository;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(@RequestParam String email, @RequestBody User userDetails) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    user.setFullName(userDetails.getFullName());
                    user.setMobileNumber(userDetails.getMobileNumber());
                    user.setPhoneNumber(userDetails.getPhoneNumber());
                    user.setUpdatedAt(LocalDateTime.now());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
