package com.orbipulse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.orbipulse.model.Pipeline;

public interface PipelineRepository extends JpaRepository<Pipeline, Long> {
}
