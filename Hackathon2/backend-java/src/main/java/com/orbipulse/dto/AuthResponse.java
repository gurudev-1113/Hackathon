package com.orbipulse.dto;

import java.time.LocalDateTime;

public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private UserDTO user;
    private LocalDateTime expiresAt;
    
    public AuthResponse() {}
    
    public AuthResponse(String token, UserDTO user, LocalDateTime expiresAt) {
        this.token = token;
        this.user = user;
        this.expiresAt = expiresAt;
    }
    
    public static class UserDTO {
        private Long id;
        private String fullName;
        private String email;
        private String mobileNumber;
        private String phoneNumber;
        private LocalDateTime createdAt;
        
        public UserDTO() {}
        
        public UserDTO(Long id, String fullName, String email, String mobileNumber, String phoneNumber, LocalDateTime createdAt) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.mobileNumber = mobileNumber;
            this.phoneNumber = phoneNumber;
            this.createdAt = createdAt;
        }
        
        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getMobileNumber() { return mobileNumber; }
        public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
        
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
    
    // Getters and setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
    
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
