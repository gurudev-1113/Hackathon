package com.orbipulse.controller;

import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.orbipulse.service.DataService;

@RestController
@RequestMapping("/alerts")
@CrossOrigin
public class AlertController {

    private final DataService dataService;

    public AlertController(DataService dataService){
        this.dataService = dataService;
    }

    @GetMapping
    public JsonNode getAlerts() throws Exception {
        return dataService.loadAlerts().get("alerts");
    }
}