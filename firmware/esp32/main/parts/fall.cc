#include "fall.h"


class FallDetector {
  FallDetector() : fall_detected(false), in_free_fall(false), impact_occured(false), d_index(0) {
    FREE_FALL_THRESHOLD = 3.5;
    IMPACT_THRESHOLD = 25.0;
    INACTIVITY_THRESHOLD = 20.0;
  }

  void process_sensor_data(const MPUPayload& data) const {
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
        impact_occured = false;
      } else {
        impact_occured = false;
      }
    }
  }

  bool is_fall() {
    if(fall_detected) {
      fall_detected = false;
      return true;
    }

    return false;
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
