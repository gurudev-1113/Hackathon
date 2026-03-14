package com.orbipulse.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.orbipulse.model.Valve;
import com.orbipulse.repository.ValveRepository;

@RestController
@RequestMapping("/valves")
@CrossOrigin
public class ValveController {

    private final ValveRepository valveRepository;

    public ValveController(ValveRepository valveRepository){
        this.valveRepository = valveRepository;
    }

    @GetMapping
    public List<Valve> getValves() {
        return valveRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Valve> getValve(@PathVariable String id) {
        Optional<Valve> valve = valveRepository.findByDeviceId(id);
        return valve.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Valve createValve(@RequestBody Valve valve) {
        return valveRepository.save(valve);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Valve> updateValve(@PathVariable String id, @RequestBody Valve valveDetails) {
        Optional<Valve> valveOptional = valveRepository.findByDeviceId(id);
        if (valveOptional.isPresent()) {
            Valve valve = valveOptional.get();
            valve.setName(valveDetails.getName());
            valve.setLat(valveDetails.getLat());
            valve.setLon(valveDetails.getLon());
            valve.setStatus(valveDetails.getStatus());
            valve.setBattery(valveDetails.getBattery());
            valve.setValve_position(valveDetails.getValve_position());
            valve.setBattery_voltage(valveDetails.getBattery_voltage());
            valve.setMotor_current(valveDetails.getMotor_current());
            valve.setTemperature(valveDetails.getTemperature());
            valve.setSignal_strength(valveDetails.getSignal_strength());
            return ResponseEntity.ok(valveRepository.save(valve));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteValve(@PathVariable String id) {
        Optional<Valve> valve = valveRepository.findByDeviceId(id);
        if (valve.isPresent()) {
            valveRepository.delete(valve.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/bulk")
    public List<Valve> createValves(@RequestBody List<Valve> valves) {
        return valveRepository.saveAll(valves);
    }

    @PostMapping("/{id}/command")
    public String command(@PathVariable String id,
                          @RequestBody JsonNode body){
        String command = body.get("command").asText();
        return "Command "+command+" sent to "+id;
    }
}