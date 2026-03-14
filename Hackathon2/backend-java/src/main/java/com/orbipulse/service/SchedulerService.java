package com.orbipulse.service;

import com.orbipulse.model.Schedule;
import com.orbipulse.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchedulerService {

 private final ScheduleRepository repo;

 public SchedulerService(ScheduleRepository repo){
  this.repo = repo;
 }

 public void runSchedule(){

  List<Schedule> schedules = repo.findAll();

  long now = System.currentTimeMillis();

  for(Schedule s : schedules){

   if(now >= s.getStartTime()){

    System.out.println("Starting irrigation for valve "+s.getValveId());

   }

  }

 }

}