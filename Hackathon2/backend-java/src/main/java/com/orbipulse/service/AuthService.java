package com.orbipulse.service;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orbipulse.dto.AuthResponse;
import com.orbipulse.dto.LoginRequest;
import com.orbipulse.dto.RegistrationRequest;
import com.orbipulse.model.User;
import com.orbipulse.repository.UserRepository;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepo, PasswordEncoder passwordEncoder, JwtService jwtService){
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegistrationRequest request) {
        // Check if user already exists
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepo.existsByMobileNumber(request.getMobileNumber())) {
            throw new RuntimeException("Mobile number already registered");
        }

        // Create new user
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobileNumber(request.getMobileNumber());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepo.save(user);
        
        // Generate JWT token
        String token = jwtService.generateToken(savedUser);
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(24); // 24 hours expiry
        
        // Create user DTO
        AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO(
            savedUser.getId(),
            savedUser.getFullName(),
            savedUser.getEmail(),
            savedUser.getMobileNumber(),
            null, // No phone number
            savedUser.getCreatedAt()
        );
        
        return new AuthResponse(token, userDTO, expiresAt);
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier();
        String password = request.getPassword();

        // Find user by email or mobile number
        User user;
        if (isEmail(identifier)) {
            user = userRepo.findByEmail(identifier)
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        } else {
            user = userRepo.findByMobileNumber(identifier)
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        }

        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(24);
        
        // Create user DTO
        AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getMobileNumber(),
            null, // No phone number
            user.getCreatedAt()
        );
        
        return new AuthResponse(token, userDTO, expiresAt);
    }

    private boolean isEmail(String identifier) {
        Pattern emailPattern = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
        return emailPattern.matcher(identifier).matches();
    }

    public User getUserById(Long userId) {
        return userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}