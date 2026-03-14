package com.orbipulse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.orbipulse.model.Telemetry;

@Repository
public interface TelemetryRepository extends JpaRepository<Telemetry, Long> {
}