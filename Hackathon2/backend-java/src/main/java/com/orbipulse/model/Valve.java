package com.orbipulse.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "valves")
public class Valve {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(nullable = false)
 public String name;

 @Column(nullable = false)
 public double lat;

 @Column(nullable = false)
 public double lon;

 @Column(nullable = false)
 public int battery;

 @Column(nullable = false, unique = true)
 public String device_id;
 
 @Column(nullable = true)
 public String gateway_id;
 
 @Column(nullable = true)
 public String zone;
 
 @Column(nullable = false)
 public int valve_position;
 
 @Column(nullable = false)
 public double battery_voltage;
 
 @Column(nullable = false)
 public double motor_current;
 
 @Column(nullable = false)
 public int temperature;
 
 @Column(nullable = false)
 public int signal_strength;
 
 @Column(nullable = false)
 public String status;

 @Column(nullable = false)
 public String type = "VALVE";

 public Long getId() {
  return id;
 }

 public void setId(Long id) {
  this.id = id;
 }

 public String getName() {
  return name;
 }

 public void setName(String name) {
  this.name = name;
 }

 public double getLat() {
  return lat;
 }

 public void setLat(double lat) {
  this.lat = lat;
 }

 public double getLon() {
  return lon;
 }

 public void setLon(double lon) {
  this.lon = lon;
 }

 public int getBattery() {
  return battery;
 }

 public void setBattery(int battery) {
  this.battery = battery;
 }

 public String getDevice_id() {
  return device_id;
 }

 public void setDevice_id(String device_id) {
  this.device_id = device_id;
 }

 public String getGateway_id() {
  return gateway_id;
 }

 public void setGateway_id(String gateway_id) {
  this.gateway_id = gateway_id;
 }

 public String getZone() {
  return zone;
 }

 public void setZone(String zone) {
  this.zone = zone;
 }

 public int getValve_position() {
  return valve_position;
 }

 public void setValve_position(int valve_position) {
  this.valve_position = valve_position;
 }

 public double getBattery_voltage() {
  return battery_voltage;
 }

 public void setBattery_voltage(double battery_voltage) {
  this.battery_voltage = battery_voltage;
 }

 public double getMotor_current() {
  return motor_current;
 }

 public void setMotor_current(double motor_current) {
  this.motor_current = motor_current;
 }

 public int getTemperature() {
  return temperature;
 }

 public void setTemperature(int temperature) {
  this.temperature = temperature;
 }

 public int getSignal_strength() {
  return signal_strength;
 }

 public void setSignal_strength(int signal_strength) {
  this.signal_strength = signal_strength;
 }

 public String getStatus() {
  return status;
 }

 public void setStatus(String status) {
  this.status = status;
 }

 public String getType() {
  return type;
 }

 public void setType(String type) {
  this.type = type;
 }
}