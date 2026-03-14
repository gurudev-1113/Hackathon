package com.orbipulse.algorithm;

import com.orbipulse.model.Telemetry;

public class LeakDetection {

    public static boolean detectLeak(Telemetry t){

        if(t.getFlowRate() > 5 && t.getMotorCurrent() < 0.5){
            return true;
        }

        return false;
    }

}