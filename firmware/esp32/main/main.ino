#include <Arduino.h>
#include "parts/fall.cc"
#include <vector>


void setup() {
  // put your setup code that will be executed once here:
  Serial.begin(115200);
}


void loop() {
  // put your code that will be executed in loop here:

  FallDetector fd;
  std::vector<MPUPayload> test_seq;

  for(int i = 0; i < 10; ++i) {
    test_seq.push_back({0.1, 0.1, G_FORCE, 0, 0, 0});
  }

  test_seq.push_back({0.5, 0.3, 0.4, 0, 0, 0});
  test_seq.push_back({0.2, -0.1, 0.3, 0, 0, 0});
  test_seq.push_back({15.0, 5.0, -25.0, 0, 0, 0});

  for(int i = 0; i < 50; ++i) {
    test_seq.push_back({0.1, 0.1, 0.1, 0, 0, 0});
  }

  bool fall_was_detected = false;

  for(size_t i = 0; i < test_seq.size(); i++) {
    fd.process_sensor_data(test_seq[i]);

    if(fd.is_fall()) {
      Serial.println("A fall was detected at sample, that's good...");
      fall_was_detected = true;
    }
  }

  if(!fall_was_detected) {
    Serial.println("No falls was detected at sample :(");
  }
}
