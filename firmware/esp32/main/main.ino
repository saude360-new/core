#include <Wire.h>
#include <ArduinoJson.h>
#include "MPU6050.h"
#include <MAX30105.h>
#include "heartRate.h"
#include "BluetoothSerial.h"
#include "spo2_algorithm.h"
#include "parts/fall.h"

#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include <SPI.h>

// === Bluetooth ===
BluetoothSerial SerialBT;

// === Sensores ===
MPU6050 mpu;
MAX30105 particleSensor;
FallDetector fd;

// === Display ST7789 ===
#define TFT_MOSI 13
#define TFT_SCLK 14
#define TFT_DC   27
#define TFT_RST  4
#define TFT_CS   -1

SPIClass spi(VSPI);
Adafruit_ST7789 tft = Adafruit_ST7789(&spi, TFT_CS, TFT_DC, TFT_RST);

// === Pinos ===
#define LM35_PIN 12  // altere se necessário, 13 está sendo usado no display

// === Tempo sem delay ===
unsigned long tempoInicio = 0;
const unsigned long intervalo = 10000; // 10 segundos
unsigned long tempoTela = 0;
const unsigned long intervaloTela = 5000; // 5 segundos entre telas

// === Buffers e Variáveis ===
uint32_t irBuffer[100];
uint32_t redBuffer[100];
int32_t bufferLength;
int32_t spo2;
int8_t validSPO2;
int32_t heartRate;
int8_t validHeartRate;
float temperature = 0.0;
int telaAtual = 0; // 0=BPM, 1=SpO2, 2=Temp, 3=Todos

// === Funções ===
float tempRead() {
  int analogValue = analogRead(LM35_PIN);
  float voltage = (analogValue / 4095.0) * 3.3;
  float temperature = voltage * 100.0;
  return temperature;
}

void sendCommonJSON(float temperature, int heartRate, int spo2) {
  StaticJsonDocument<300> doc;
  doc["temp"] = temperature;
  doc["heartRate"] = heartRate;
  doc["spo2"] = spo2;
  doc["fall"] = false;

  String output;
  serializeJson(doc, output);
  SerialBT.println(output);
  Serial.println(output);
}

void sendFallJSON() {
  StaticJsonDocument<100> doc;
  doc["alert"] = "fall_detected";
  String output;
  serializeJson(doc, output);
  SerialBT.println(output);
  Serial.println(output);
}

void mostrarTela(int tela) {
  tft.fillScreen(ST77XX_BLACK);
  tft.setTextSize(3);
  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(10, 10);

  switch (tela) {
    case 0: // BPM
      tft.setTextColor(ST77XX_RED);
      tft.println("BPM");
      tft.setTextSize(5);
      tft.setCursor(60, 100);
      tft.printf("%d", heartRate);
      break;

    case 1: // SpO2
      tft.setTextColor(ST77XX_BLUE);
      tft.println("SpO2");
      tft.setTextSize(5);
      tft.setCursor(50, 100);
      tft.printf("%d%%", spo2);
      break;

    case 2: // Temperatura
      tft.setTextColor(ST77XX_ORANGE);
      tft.println("Temp");
      tft.setTextSize(5);
      tft.setCursor(40, 100);
      tft.printf("%.1fC", temperature);
      break;

    case 3: // Todos
      tft.setTextSize(2);
      tft.setTextColor(ST77XX_RED);
      tft.setCursor(10, 30);
      tft.printf("BPM: %d", heartRate);

      tft.setTextColor(ST77XX_BLUE);
      tft.setCursor(10, 80);
      tft.printf("SpO2: %d%%", spo2);

      tft.setTextColor(ST77XX_ORANGE);
      tft.setCursor(10, 130);
      tft.printf("Temp: %.1fC", temperature);
      break;
  }
}

// === SETUP ===
void setup() {
  Serial.begin(9600);
  SerialBT.begin("ESP32-BT-Slave");

  pinMode(LM35_PIN, INPUT);
  analogSetAttenuation(ADC_11db);

  // === Display ===
  spi.begin(TFT_SCLK, -1, TFT_MOSI, 15);
  tft.init(240, 320);
  tft.setRotation(1);
  tft.invertDisplay(true);
  tft.fillScreen(ST77XX_BLACK);
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(30, 120);
  tft.println("Iniciando...");

  // === MPU6050 ===
  Wire.begin(18, 19);
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("Falha MPU6050!");
    while (1);
  }

  // === MAX30102 ===
  Wire1.begin(21, 22);
  if (!particleSensor.begin(Wire1)) {
    Serial.println("Falha MAX30102!");
    while (1);
  }

  byte ledBrightness = 60;
  byte sampleAverage = 4;
  byte ledMode = 2;
  byte sampleRate = 100;
  int pulseWidth = 411;
  int adcRange = 4096;
  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange);

  Serial.println("Sistema iniciado.");
  tempoInicio = millis();
  tempoTela = millis();
  mostrarTela(telaAtual);
}

// === LOOP PRINCIPAL ===
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

  fd.process_sensor_data(payload);
  if (fd.is_fall()) {
    Serial.println("⚠️ Queda detectada!");
    sendFallJSON();

    // === Tela vermelha por 30 segundos ===
    tft.fillScreen(ST77XX_RED);
    tft.setTextColor(ST77XX_BLACK);
    tft.setTextSize(6);
    tft.setCursor(40, 120);
    tft.println("QUEDA");
    unsigned long inicio = millis();
    while (millis() - inicio < 30000) {
      delay(100); // pequena pausa para aliviar CPU
    }

    mostrarTela(telaAtual);
  }

  // === Leitura MAX30102 ===
  bufferLength = 100;
  for (byte i = 0; i < bufferLength; i++) {
    while (!particleSensor.available()) particleSensor.check();
    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();
    particleSensor.nextSample();
  }
  maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer,
                                         &spo2, &validSPO2, &heartRate, &validHeartRate);

  // === Atualiza dados a cada 10 segundos ===
  if (millis() - tempoInicio >= intervalo) {
    temperature = tempRead();
    Serial.printf("BPM: %d | SpO2: %d | Temp: %.1f\n", heartRate, spo2, temperature);
    sendCommonJSON(temperature, heartRate, spo2);
    tempoInicio = millis();
  }

  // === Troca de tela a cada 5 segundos ===
  if (millis() - tempoTela >= intervaloTela) {
    telaAtual = (telaAtual + 1) % 4;
    mostrarTela(telaAtual);
    tempoTela = millis();
  }
}
