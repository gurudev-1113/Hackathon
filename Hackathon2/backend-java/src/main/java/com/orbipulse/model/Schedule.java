package com.orbipulse.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "schedules")
public class Schedule {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(nullable = false)
 public String schedule_id;
 
 @Column(nullable = false)
 public String device_id;
 
 @Column(nullable = false)
 public String start_time;
 
 @Column(nullable = false)
 public int duration_minutes;
 
 @Column(nullable = false)
 public String status;

 public Long getStartTime() {
  return Long.parseLong(start_time);
 }

 public String getValveId() {
  return device_id;
 }
}