package com.orbipulse.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "telemetry")
public class Telemetry {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(nullable = false)
 private String deviceId;
 
 @Column(nullable = false)
 private double flowRate;
 
 @Column(nullable = false)
 private double motorCurrent;
 
 @Column(nullable = false)
 private double batteryVoltage;
 
 @Column(nullable = false)
 private double temperature;

 public Telemetry(){}

 public Long getId() {
  return id;
 }

 public void setId(Long id) {
  this.id = id;
 }

 public String getDeviceId() {
  return deviceId;
 }

 public void setDeviceId(String deviceId) {
  this.deviceId = deviceId;
 }

 public double getFlowRate() {
  return flowRate;
 }

 public void setFlowRate(double flowRate) {
  this.flowRate = flowRate;
 }

 public double getMotorCurrent() {
  return motorCurrent;
 }

 public void setMotorCurrent(double motorCurrent) {
  this.motorCurrent = motorCurrent;
 }

 public double getBatteryVoltage() {
  return batteryVoltage;
 }

 public void setBatteryVoltage(double batteryVoltage) {
  this.batteryVoltage = batteryVoltage;
 }

 public double getTemperature() {
  return temperature;
 }

 public void setTemperature(double temperature) {
  this.temperature = temperature;
 }
}