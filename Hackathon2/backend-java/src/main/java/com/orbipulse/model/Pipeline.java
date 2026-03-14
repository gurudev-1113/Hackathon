package com.orbipulse.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pipelines")
public class Pipeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fromDeviceId;
    private String toDeviceId;
    private String type = "MAIN"; // MAIN, SUB, DRIP

    public Pipeline() {}

    public Pipeline(String fromDeviceId, String toDeviceId, String type) {
        this.fromDeviceId = fromDeviceId;
        this.toDeviceId = toDeviceId;
        this.type = type;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFromDeviceId() { return fromDeviceId; }
    public void setFromDeviceId(String fromDeviceId) { this.fromDeviceId = fromDeviceId; }

    public String getToDeviceId() { return toDeviceId; }
    public void setToDeviceId(String toDeviceId) { this.toDeviceId = toDeviceId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
