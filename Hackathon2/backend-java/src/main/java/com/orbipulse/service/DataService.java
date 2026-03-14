package com.orbipulse.service;

import java.io.File;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class DataService {

    private final ObjectMapper mapper = new ObjectMapper();

    public JsonNode loadNetwork() throws Exception {
        return mapper.readTree(new File("data/orbipulse_network_dataset.json"));
    }

    public JsonNode loadAlerts() throws Exception {
        return mapper.readTree(new File("data/orbipulse_alerts_sample.json"));
    }

    public JsonNode loadSchedule() throws Exception {
        return mapper.readTree(new File("data/orbipulse_irrigation_schedule.json"));
    }
}