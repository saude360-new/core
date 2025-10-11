#pragma once

#include <Arduino.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>


#define G_FORCE 9.81f


typedef struct {
  float ax;
  float ay;
  float az;
  float gx;
  float gy;
  float gz;
} MPUPayload;
