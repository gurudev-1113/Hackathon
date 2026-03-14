package com.orbipulse.algorithm;

public class DeviceHealthAnalyzer {

 public static int healthScore(double motorCurrent,double temperature,double battery){

  int score = 100;

  if(motorCurrent > 5) score -= 20;
  if(temperature > 70) score -= 30;
  if(battery < 30) score -= 25;

  return Math.max(score,0);

 }

}