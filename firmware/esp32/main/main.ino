#include <Wire.h>
#include <ArduinoJson.h>
#include "MPU6050.h"
#include <MAX30105.h>
#include "heartRate.h"
#include "BluetoothSerial.h"
#include "spo2_algorithm.h"

// === Bluetooth ===
BluetoothSerial SerialBT;

// === Sensores ===
MPU6050 mpu;
MAX30105 particleSensor;

// === Pinos ===
#define LM35_PIN 13

// === Tempo sem delay ===
unsigned long tempoInicio = 0;
const unsigned long intervalo = 10000; // 10 segundos (ajustável)

// === Buffers e Variáveis ===
uint32_t irBuffer[100];
uint32_t redBuffer[100];
int32_t bufferLength;
int32_t spo2;
int8_t validSPO2;
int32_t heartRate;
int8_t validHeartRate;

// === Estrutura MPU ===
typedef struct {
  float ax;
  float ay;
  float az;
  float gx;
  float gy;
  float gz;
} MPUPayload;

// === Classe simples para detectar quedas ===
class FallDetector {
public:
  bool process_sensor_data(const MPUPayload& data) {
    // Magnitude da aceleração total (m/s² aproximado)
    float magnitude = sqrt(data.ax * data.ax + data.ay * data.ay + data.az * data.az);

    // Detecta pico abrupto seguido de baixa aceleração — padrão típico de queda
    if (magnitude > 15.0) {
      last_peak = millis();
    }

    if (millis() - last_peak < 500 && magnitude < 3.0) {
      if (!fall_detected) {
        fall_detected = true;
        return true;
      }
    } else if (millis() - last_peak > 1000) {
      fall_detected = false;
    }

    return false;
  }

private:
  unsigned long last_peak = 0;
  bool fall_detected = false;
};

// === Instância global ===
FallDetector fd;

// === Funções ===
float tempRead() {
  int analogValue = analogRead(LM35_PIN);
  float voltage = (analogValue / 4095.0) * 3.3;
  float temperature = voltage * 100.0;
  return temperature;
}

void sendCommonJSON(float temperature, int heartRate, int spo2, bool fall) {
  StaticJsonDocument<300> doc;
  doc["temp"] = temperature;
  doc["heartRate"] = heartRate;
  doc["spo2"] = spo2;
  doc["fallDetected"] = fall;

  String output;
  serializeJson(doc, output);
  SerialBT.println(output);
  Serial.println(output);
}

void sendFallJSON(){
  //todo melhorar esta função
  SerialBT.println("Queda detectada");
}

void setup() {
  Serial.begin(9600);
  SerialBT.begin("ESP32-BT-Slave");

  pinMode(LM35_PIN, INPUT);
  analogSetAttenuation(ADC_11db);

  // === Inicializa MPU6050 ===
  Wire.begin(18, 19);
  Serial.println("Inicializando MPU6050...");
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("Falha ao iniciar MPU6050!");
    while (1);
  }

  // === Inicializa MAX30102 ===
  Wire1.begin(21, 22);
  Serial.println("Inicializando MAX30102...");
  if (!particleSensor.begin(Wire1)) {
    Serial.println("Falha ao iniciar MAX30102!");
    while (1);
  }

  // === Configura MAX30102 ===
  byte ledBrightness = 60;
  byte sampleAverage = 4;
  byte ledMode = 2;
  byte sampleRate = 100;
  int pulseWidth = 411;
  int adcRange = 4096;
  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange);

  tempoInicio = millis();
}

void loop() {
  // === Leitura MPU6050 ===
  int16_t ax_raw, ay_raw, az_raw;
  int16_t gx_raw, gy_raw, gz_raw;
  mpu.getMotion6(&ax_raw, &ay_raw, &az_raw, &gx_raw, &gy_raw, &gz_raw);


  MPUPayload payload = {
    ax_raw / 16384.0,
    ay_raw / 16384.0,
    az_raw / 16384.0,
    gx_raw / 131.0,
    gy_raw / 131.0,
    gz_raw / 131.0
  };

  bool fallDetected = fd.process_sensor_data(payload);

  if (fallDetected){

    sendFallJSON();
  }


  // === Leitura MAX30102 ===
  bufferLength = 100;
  for (byte i = 0; i < bufferLength; i++) {
    while (!particleSensor.available()) particleSensor.check();
    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();
    particleSensor.nextSample();
  }
  maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

  // === Temporizador ===
  if (millis() - tempoInicio >= intervalo) {
    float temperature = tempRead();

    Serial.println("----- Relatório de 10 segundos -----");
    Serial.print("Heart Rate: "); Serial.println(heartRate);
    Serial.print("SpO2: "); Serial.println(spo2);
    Serial.print("Temperatura: "); Serial.println(temperature);
    Serial.print("Fall Detected: "); Serial.println(fallDetected ? "SIM" : "NÃO");
    Serial.println("------------------------------------");

    sendCommonJSON(temperature, heartRate, spo2, fallDetected);
    tempoInicio = millis();
  }
}
