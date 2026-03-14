package com.orbipulse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.orbipulse.model.Valve;

@Repository
public interface ValveRepository extends JpaRepository<Valve, Long>{

 @Query("SELECT v FROM Valve v WHERE v.device_id = :device_id")
 Optional<Valve> findByDeviceId(@Param("device_id") String device_id);

}