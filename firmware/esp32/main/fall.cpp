#include "parts/fall.h"
#include <math.h>

FallDetector::FallDetector() : 
  fall_detected(false), 
  in_free_fall(false), 
  impact_occured(false), 
  d_index(0) 
{
  FREE_FALL_THRESHOLD = 0.5;
  IMPACT_THRESHOLD = 2.5;
  INACTIVITY_THRESHOLD = 0.2;
}


void FallDetector::process_sensor_data(const MPUPayload& data) {
  float va = calculate_va(data);
  update_recent_data(data);

  if(va < FREE_FALL_THRESHOLD) {
    in_free_fall = true;
  }

  if(in_free_fall && va > IMPACT_THRESHOLD) {
    impact_occured = true;
    in_free_fall = false;
  }

  if(impact_occured) {
    float sa = calculate_sa();

    if(sa < INACTIVITY_THRESHOLD) {
      fall_detected = true;
    }
      
    impact_occured = false; 
  }
}

bool FallDetector::is_fall() {
  if(fall_detected) {
    fall_detected = false;
    return true;
  }

  return false;
}


float FallDetector::calculate_va(const MPUPayload& data) const {
  return sqrt(pow(data.ax, 2) + pow(data.ay, 2) + pow(data.az, 2));
}


float FallDetector::calculate_gs(const MPUPayload& data) const {
  return sqrt(pow(data.gy, 2) + pow(data.gz, 2));
}


float FallDetector::calculate_sa() const {
  float s = 0.0;

  for(int i = 0; i < RECENT_DATA_SIZE; ++i) {
    s += abs(recent_data[i].ax) + abs(recent_data[i].ay) + abs(recent_data[i].az);
  }

  return s;
}


void FallDetector::update_recent_data(const MPUPayload& data) {
  recent_data[d_index] = data;
  d_index = (d_index + 1) % RECENT_DATA_SIZE;
}
