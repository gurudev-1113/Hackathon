package com.orbipulse.service;

import com.orbipulse.model.Valve;
import com.orbipulse.repository.ValveRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ValveService {

 private final ValveRepository valveRepo;

 public ValveService(ValveRepository valveRepo){
  this.valveRepo = valveRepo;
 }

 public List<Valve> getValves(){
  return valveRepo.findAll();
 }

 public String executeCommand(Long id,String command){

  Valve valve = valveRepo.findById(id).orElseThrow();

  valve.setStatus(command);

  valveRepo.save(valve);

  return "Valve "+id+" set to "+command;

 }

}