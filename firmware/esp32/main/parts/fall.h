#ifndef FALLDETECTOR_H
#define FALLDETECTOR_H

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
public:
  FallDetector();
  void process_sensor_data(const MPUPayload& data);
  bool is_fall();

private:
  float FREE_FALL_THRESHOLD;
  float IMPACT_THRESHOLD;
  float INACTIVITY_THRESHOLD;
  unsigned long INACTIVITY_WINDOW_MS;

  bool fall_detected;
  bool in_free_fall;
  bool impact_occured;
  unsigned long impact_timestamp;

  static const int RECENT_DATA_SIZE = 50;
  MPUPayload recent_data[RECENT_DATA_SIZE];
  int d_index;

  float calculate_va(const MPUPayload& data) const;
  float calculate_gs(const MPUPayload& data) const;
  float calculate_sa() const;
  void update_recent_data(const MPUPayload& data);
};

#endif
