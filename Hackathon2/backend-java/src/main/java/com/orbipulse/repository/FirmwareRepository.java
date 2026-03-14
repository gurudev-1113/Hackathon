package com.orbipulse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.orbipulse.model.Firmware;

@Repository
public interface FirmwareRepository extends JpaRepository<Firmware, Long> {
}
