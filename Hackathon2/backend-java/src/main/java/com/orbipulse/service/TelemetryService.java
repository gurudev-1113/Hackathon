package com.orbipulse.service;

import org.springframework.stereotype.Service;

import com.orbipulse.algorithm.LeakDetection;
import com.orbipulse.model.Telemetry;
import com.orbipulse.repository.TelemetryRepository;

@Service
public class TelemetryService {

 private final TelemetryRepository telemetryRepo;
 private final AlertService alertService;

 public TelemetryService(TelemetryRepository repo, AlertService alertService){
  this.telemetryRepo = repo;
  this.alertService = alertService;
 }

 public void processTelemetry(Telemetry telemetry){

  telemetryRepo.save(telemetry);

  if(LeakDetection.detectLeak(telemetry)){
     alertService.raiseAlert(
       telemetry.getDeviceId(),
       "LEAK",
       "HIGH"
     );
  }

 }

}