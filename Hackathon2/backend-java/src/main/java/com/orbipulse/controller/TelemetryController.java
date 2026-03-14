package com.orbipulse.controller;

import com.orbipulse.model.Telemetry;
import com.orbipulse.service.TelemetryService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/telemetry")
public class TelemetryController {

 private final TelemetryService telemetryService;

 public TelemetryController(TelemetryService telemetryService){
  this.telemetryService = telemetryService;
 }

 @PostMapping
 public String ingest(@RequestBody Telemetry telemetry){

  telemetryService.processTelemetry(telemetry);

  return "Telemetry processed";
 }

}