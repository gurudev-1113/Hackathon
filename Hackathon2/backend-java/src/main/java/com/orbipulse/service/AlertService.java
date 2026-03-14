package com.orbipulse.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class AlertService {

    private final List<Map<String,String>> alerts = new ArrayList<>();

    public void raiseAlert(String deviceId, String type, String severity){

        Map<String,String> alert = new HashMap<>();

        alert.put("device_id",deviceId);
        alert.put("type",type);
        alert.put("severity",severity);

        alerts.add(alert);
    }

    public List<Map<String,String>> getAlerts(){
        return alerts;
    }
}