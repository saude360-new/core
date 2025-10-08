/*
  ATTENTION: SPLIT THIS FILE INTO A LIB-LIKE STRUCTURE WITH HEADER DECLARATION (.h)
  AND A FUNCIONAL FILE WITH IMPLEMENTATION ONLY (.cc)
*/

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


class FallDetector {
  FallDetector() : fall_detected(false), in_free_fall(false), impact_occured(false), d_index(0) {
    FREE_FALL_THRESHOLD = 3.5;
    IMPACT_THRESHOLD = 25.0;
    INACTIVITY_THRESHOLD = 20.0;
  }

  bool process_sensor_data(const MPUPayload& data) const {
    if(calculate_va(data) >= FREE_FALL_THRESHOLD) {
      in_free_fall = true;
    } else {
      in_free_fall = false;
    }

    if(calculate_gs(data) >= IMPACT_THRESHOLD) {
      impact_occured = true;
    } else {
      impact_occured = false;
    }

    if(calculate_sa(data) >= INACTIVITY_THRESHOLD) {
      if(!in_free_fall && impact_occured) {
        fall_detected = true;
      } else {
        fall_detected = false;
      }
    } else {
      fall_detected = false;
    }

    return fall_detected;
  }

  private:
    float FREE_FALL_THRESHOLD;
    float IMPACT_THRESHOLD;
    float INACTIVITY_THRESHOLD;

    bool fall_detected;
    bool in_free_fall;
    bool impact_occured;

    static const int RECENT_DATA_SIZE = 50;
    MPUPayload recent_data[RECENT_DATA_SIZE];

    int d_index;

    float calculate_va(const MPUPayload& data) const {
      return sqrt(pow(data.ax, 2) + pow(data.ay, 2) + pow(data.az, 2));
    }

    float calculate_gs(const MPUPayload& data) const {
      return sqrt(pow(data.gy, 2) + pow(data.gz, 2));
    }

    float calculate_sa() const {
      float s = 0.0;

      for(int i = 0; i < RECENT_DATA_SIZE; ++i) {
        s += abs(recent_data[i].ax) + abs(recent_data[i].ay) + abs(recent_data[i].az);
      }

      return s;
    }

    void update_recent_data(const MPUPayload& data) {
      recent_data[d_index] = data;
      d_index = (d_index + 1) % RECENT_DATA_SIZE;
    }
};
