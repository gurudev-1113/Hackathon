package com.orbipulse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orbipulse.model.User;

public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> findByEmail(String email);
    
    Optional<User> findByMobileNumber(String mobileNumber);
    
    Optional<User> findByPhoneNumber(String phoneNumber);
    
    boolean existsByEmail(String email);
    
    boolean existsByMobileNumber(String mobileNumber);
    
    boolean existsByPhoneNumber(String phoneNumber);

}