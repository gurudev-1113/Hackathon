package com.orbipulse.dto;

public class CommandRequest {

    private String command;
    private Integer value;

    public CommandRequest() {
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }
}