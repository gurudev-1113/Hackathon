package com.orbipulse.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.orbipulse.service.DataService;

@RestController
@RequestMapping("/schedule")
@CrossOrigin
public class ScheduleController {

    private final DataService dataService;

    public ScheduleController(DataService dataService){
        this.dataService = dataService;
    }

    @GetMapping
    public JsonNode getSchedule() throws Exception {
        return dataService.loadSchedule().get("schedules");
    }
}