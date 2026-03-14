package com.orbipulse.controller;

import java.util.List;
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
import com.orbipulse.model.Firmware;
import com.orbipulse.repository.FirmwareRepository;

@RestController
@RequestMapping("/firmware")
@CrossOrigin
public class FirmwareController {

    private final FirmwareRepository firmwareRepository;

    public FirmwareController(FirmwareRepository firmwareRepository) {
        this.firmwareRepository = firmwareRepository;
    }

    @GetMapping
    public List<Firmware> getAllFirmware() {
        return firmwareRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Firmware> getFirmware(@PathVariable Long id) {
        return firmwareRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Firmware createFirmware(@RequestBody Firmware firmware) {
        return firmwareRepository.save(firmware);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Firmware> updateFirmware(@PathVariable Long id, @RequestBody Firmware firmwareDetails) {
        return firmwareRepository.findById(id)
                .map(firmware -> {
                    firmware.setVersion(firmwareDetails.getVersion());
                    firmware.setDescription(firmwareDetails.getDescription());
                    firmware.setFileUrl(firmwareDetails.getFileUrl());
                    return ResponseEntity.ok(firmwareRepository.save(firmware));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFirmware(@PathVariable Long id) {
        return firmwareRepository.findById(id)
                .map(firmware -> {
                    firmwareRepository.delete(firmware);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
