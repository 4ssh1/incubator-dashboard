#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <ESP32Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// ============ WiFi Configuration ============
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ============ MQTT Configuration ============
const char* mqtt_server = "broker.hivemq.com";  // Free public broker
const int mqtt_port = 1883;
const char* mqtt_client_id = "ESP32_Incubator_001";

// MQTT Topics
const char* TOPIC_STATUS = "incubator/esp32/status";
const char* TOPIC_SENSORS = "incubator/esp32/sensors";
const char* TOPIC_CONTROL = "incubator/esp32/control";
const char* TOPIC_RESPONSE = "incubator/esp32/response";

// ============ Hardware Pins ============
#define DHT_PIN 4
#define DHT_TYPE DHT11

// I2C Pins for LCD (ESP32 default)
#define I2C_SDA 21
#define I2C_SCL 22

#define RELAY_HEATER 26
#define RELAY_INTERNAL_FAN 27
#define RELAY_SOLAR_FANS 14
#define RELAY_SOLENOID 23

#define SERVO_SOLAR_INLET 12
#define SERVO_TOP_VENT 13

#define STEPPER_STEP 18
#define STEPPER_DIR 19
#define STEPPER_ENABLE 32

// ============ Global Objects ============
WiFiClient espClient;
PubSubClient mqtt(espClient);
DHT dht(DHT_PIN, DHT_TYPE);

Servo servoSolarInlet;
Servo servoTopVent;

// LCD I2C (address 0x27 for 16x2 display)
// If 0x27 doesn't work, try 0x3F
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ============ Global Variables ============
unsigned long lastSensorRead = 0;
unsigned long sensorInterval = 5000;  // 5 seconds default
unsigned long lastLCDUpdate = 0;
unsigned long lcdUpdateInterval = 2000;  // Update LCD every 2 seconds

float currentTemp = 0.0;
float currentHumidity = 0.0;

// Device states
bool heaterState = false;
bool internalFanState = false;
bool solarFansState = false;
bool solenoidState = false;
int solarInletAngle = 0;
int topVentAngle = 0;

// LCD display mode
int displayMode = 0;  // 0=Temp/Humidity, 1=Status, 2=Network

// ============ Custom LCD Characters ============
byte thermometerChar[8] = {
  0b00100,
  0b01010,
  0b01010,
  0b01010,
  0b01110,
  0b11111,
  0b11111,
  0b01110
};

byte dropletChar[8] = {
  0b00100,
  0b00100,
  0b01010,
  0b01010,
  0b10001,
  0b10001,
  0b10001,
  0b01110
};

byte wifiChar[8] = {
  0b00000,
  0b00000,
  0b00001,
  0b00001,
  0b00101,
  0b00101,
  0b10101,
  0b00000
};

// ============ Setup ============
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n\n=================================");
  Serial.println("ESP32 Incubator MQTT Starting...");
  Serial.println("=================================\n");
  
  // Initialize I2C for LCD
  Wire.begin(I2C_SDA, I2C_SCL);
  
  // Initialize LCD
  lcd.init();
  lcd.backlight();
  lcd.clear();
  
  // Create custom characters
  lcd.createChar(0, thermometerChar);
  lcd.createChar(1, dropletChar);
  lcd.createChar(2, wifiChar);
  
  // Display startup message
  lcd.setCursor(0, 0);
  lcd.print("ESP32 Incubator");
  lcd.setCursor(0, 1);
  lcd.print("Starting up...");
  delay(2000);
  
  Serial.println("✓ LCD initialized");
  
  // Initialize DHT sensor
  dht.begin();
  Serial.println("✓ DHT11 sensor initialized");
  
  // Configure relay pins
  pinMode(RELAY_HEATER, OUTPUT);
  pinMode(RELAY_INTERNAL_FAN, OUTPUT);
  pinMode(RELAY_SOLAR_FANS, OUTPUT);
  pinMode(RELAY_SOLENOID, OUTPUT);
  
  // Turn off all relays
  digitalWrite(RELAY_HEATER, LOW);
  digitalWrite(RELAY_INTERNAL_FAN, LOW);
  digitalWrite(RELAY_SOLAR_FANS, LOW);
  digitalWrite(RELAY_SOLENOID, LOW);
  Serial.println("✓ All relays set to OFF");
  
  // Configure stepper pins
  pinMode(STEPPER_STEP, OUTPUT);
  pinMode(STEPPER_DIR, OUTPUT);
  pinMode(STEPPER_ENABLE, OUTPUT);
  digitalWrite(STEPPER_ENABLE, HIGH);  // Disable by default
  Serial.println("✓ Stepper motor initialized (disabled)");
  
  // Attach servos
  servoSolarInlet.attach(SERVO_SOLAR_INLET);
  servoTopVent.attach(SERVO_TOP_VENT);
  servoSolarInlet.write(0);
  servoTopVent.write(0);
  Serial.println("✓ Servo motors initialized (0°)");
  
  // Display connecting message
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connecting WiFi");
  lcd.setCursor(0, 1);
  lcd.print("Please wait...");
  
  // Connect to WiFi
  connectWiFi();
  
  // Display MQTT connecting
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connecting MQTT");
  
  // Setup MQTT
  mqtt.setServer(mqtt_server, mqtt_port);
  mqtt.setCallback(mqttCallback);
  mqtt.setKeepAlive(60);
  
  connectMQTT();
  
  // Display ready message
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("System Ready!");
  lcd.setCursor(0, 1);
  lcd.print("Monitoring...");
  delay(2000);
}

// ============ WiFi Connection ============
void connectWiFi() {
  Serial.print("\n🌐 Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    
    // Update LCD with dots
    if (attempts % 3 == 0) {
      lcd.setCursor(0, 1);
      lcd.print("                ");  // Clear line
      lcd.setCursor(0, 1);
      for (int i = 0; i < (attempts / 3); i++) {
        lcd.print(".");
      }
    }
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi Connected!");
    Serial.print("  IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("  Signal: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    
    // Display WiFi connected on LCD
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.write(2);  // WiFi icon
    lcd.print(" WiFi Connected");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP());
    delay(2000);
    
  } else {
    Serial.println("\n✗ WiFi Connection Failed!");
    Serial.println("  Please check SSID and password");
    
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi Failed!");
    lcd.setCursor(0, 1);
    lcd.print("Check Settings");
  }
}

// ============ MQTT Connection ============
void connectMQTT() {
  while (!mqtt.connected()) {
    Serial.print("\n📡 Connecting to MQTT Broker: ");
    Serial.println(mqtt_server);
    
    if (mqtt.connect(mqtt_client_id)) {
      Serial.println("✓ MQTT Connected!");
      
      // Subscribe to control topic
      mqtt.subscribe(TOPIC_CONTROL);
      Serial.print("  Subscribed to: ");
      Serial.println(TOPIC_CONTROL);
      
      // Publish online status
      publishStatus("online");
      
      // Display on LCD
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("MQTT Connected!");
      delay(1000);
      
    } else {
      Serial.print("✗ MQTT Connection Failed! Error code: ");
      Serial.println(mqtt.state());
      Serial.println("  Retrying in 5 seconds...");
      
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("MQTT Failed!");
      lcd.setCursor(0, 1);
      lcd.print("Retry in 5s...");
      
      delay(5000);
    }
  }
}

// ============ Publish Status ============
void publishStatus(const char* status) {
  StaticJsonDocument<256> doc;
  doc["status"] = status;
  doc["device"] = "ESP32_Incubator";
  doc["ip"] = WiFi.localIP().toString();
  doc["uptime"] = millis() / 1000;
  doc["rssi"] = WiFi.RSSI();
  
  char buffer[256];
  serializeJson(doc, buffer);
  
  mqtt.publish(TOPIC_STATUS, buffer, true);  // Retained message
  Serial.println("📤 Status published: " + String(status));
}

// ============ MQTT Callback (Receive Commands) ============
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.println("\n📥 Message received!");
  Serial.print("  Topic: ");
  Serial.println(topic);
  
  // Convert payload to string
  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("  Payload: ");
  Serial.println(message);
  
  // Display command received on LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Command Recv'd!");
  
  // Parse JSON
  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, message);
  
  if (error) {
    Serial.print("  ✗ JSON Parse Error: ");
    Serial.println(error.c_str());
    sendResponse("ERROR: Invalid JSON", false);
    
    lcd.setCursor(0, 1);
    lcd.print("Parse Error!");
    delay(2000);
    return;
  }
  
  // Process commands
  bool commandExecuted = false;
  String responseMsg = "";
  
  // Update interval
  if (doc.containsKey("interval")) {
    int newInterval = doc["interval"];
    if (newInterval >= 1000 && newInterval <= 60000) {
      sensorInterval = newInterval;
      responseMsg = "Interval updated to " + String(sensorInterval) + "ms";
      commandExecuted = true;
      Serial.println("  ✓ " + responseMsg);
      
      lcd.setCursor(0, 1);
      lcd.print("Interval: ");
      lcd.print(sensorInterval);
      lcd.print("ms");
    }
  }
  
  // Heater control
  if (doc.containsKey("heater")) {
    heaterState = doc["heater"];
    digitalWrite(RELAY_HEATER, heaterState ? HIGH : LOW);
    responseMsg = "Heater turned " + String(heaterState ? "ON" : "OFF");
    commandExecuted = true;
    Serial.println("  ✓ " + responseMsg);
    
    lcd.setCursor(0, 1);
    lcd.print("Heater: ");
    lcd.print(heaterState ? "ON " : "OFF");
  }
  
  // Internal fan control
  if (doc.containsKey("internal_fan")) {
    internalFanState = doc["internal_fan"];
    digitalWrite(RELAY_INTERNAL_FAN, internalFanState ? HIGH : LOW);
    responseMsg = "Internal Fan turned " + String(internalFanState ? "ON" : "OFF");
    commandExecuted = true;
    Serial.println("  ✓ " + responseMsg);
    
    lcd.setCursor(0, 1);
    lcd.print("Int Fan: ");
    lcd.print(internalFanState ? "ON " : "OFF");
  }
  
  // Solar fans control
  if (doc.containsKey("solar_fans")) {
    solarFansState = doc["solar_fans"];
    digitalWrite(RELAY_SOLAR_FANS, solarFansState ? HIGH : LOW);
    responseMsg = "Solar Fans turned " + String(solarFansState ? "ON" : "OFF");
    commandExecuted = true;
    Serial.println("  ✓ " + responseMsg);
    
    lcd.setCursor(0, 1);
    lcd.print("Sol Fans: ");
    lcd.print(solarFansState ? "ON " : "OFF");
  }
  
  // Solenoid valve control
  if (doc.containsKey("solenoid")) {
    solenoidState = doc["solenoid"];
    digitalWrite(RELAY_SOLENOID, solenoidState ? HIGH : LOW);
    responseMsg = "Solenoid " + String(solenoidState ? "OPENED" : "CLOSED");
    commandExecuted = true;
    Serial.println("  ✓ " + responseMsg);
    
    lcd.setCursor(0, 1);
    lcd.print("Valve: ");
    lcd.print(solenoidState ? "OPEN " : "CLOSE");
  }
  
  // Solar inlet servo
  if (doc.containsKey("solar_inlet")) {
    solarInletAngle = constrain(doc["solar_inlet"], 0, 180);
    servoSolarInlet.write(solarInletAngle);
    responseMsg = "Solar Inlet set to " + String(solarInletAngle) + "°";
    commandExecuted = true;
    Serial.println("  ✓ " + responseMsg);
    
    lcd.setCursor(0, 1);
    lcd.print("Solar: ");
    lcd.print(solarInletAngle);
    lcd.print((char)223);  // Degree symbol
  }
  
  // Top vent servo
  if (doc.containsKey("top_vent")) {
    topVentAngle = constrain(doc["top_vent"], 0, 180);
    servoTopVent.write(topVentAngle);
    responseMsg = "Top Vent set to " + String(topVentAngle) + "°";
    commandExecuted = true;
    Serial.println("  ✓ " + responseMsg);
    
    lcd.setCursor(0, 1);
    lcd.print("Vent: ");
    lcd.print(topVentAngle);
    lcd.print((char)223);  // Degree symbol
  }
  
  // Turn eggs
  if (doc.containsKey("turn_eggs") && doc["turn_eggs"] == true) {
    Serial.println("  ⚙️ Starting egg rotation...");
    
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Turning Eggs...");
    lcd.setCursor(0, 1);
    lcd.print("Please wait");
    
    turnEggs();
    responseMsg = "Eggs turned successfully";
    commandExecuted = true;
    Serial.println("  ✓ Egg rotation complete");
    
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Eggs Turned!");
    lcd.setCursor(0, 1);
    lcd.print("Success!");
  }
  
  // Send response
  if (commandExecuted) {
    sendResponse(responseMsg, true);
    delay(2000);  // Show message for 2 seconds
  }
}

// ============ Send Response ============
void sendResponse(String message, bool success) {
  StaticJsonDocument<256> doc;
  doc["timestamp"] = millis();
  doc["message"] = message;
  doc["success"] = success;
  
  char buffer[256];
  serializeJson(doc, buffer);
  
  mqtt.publish(TOPIC_RESPONSE, buffer);
}

// ============ Update LCD Display ============
void updateLCD() {
  lcd.clear();
  
  switch (displayMode) {
    case 0:  // Temperature and Humidity
      lcd.setCursor(0, 0);
      lcd.write(0);  // Thermometer icon
      lcd.print(" Temp: ");
      if (!isnan(currentTemp)) {
        lcd.print(currentTemp, 1);
        lcd.print((char)223);
        lcd.print("C");
      } else {
        lcd.print("--");
      }
      
      lcd.setCursor(0, 1);
      lcd.write(1);  // Droplet icon
      lcd.print(" Hum: ");
      if (!isnan(currentHumidity)) {
        lcd.print(currentHumidity, 1);
        lcd.print("%");
      } else {
        lcd.print("--");
      }
      break;
      
    case 1:  // Device Status
      lcd.setCursor(0, 0);
      lcd.print("H:");
      lcd.print(heaterState ? "ON " : "OFF");
      lcd.print(" F:");
      lcd.print(internalFanState ? "ON " : "OFF");
      
      lcd.setCursor(0, 1);
      lcd.print("SF:");
      lcd.print(solarFansState ? "ON" : "OF");
      lcd.print(" V:");
      lcd.print(solenoidState ? "OP" : "CL");
      break;
      
    case 2:  // Network Info
      lcd.setCursor(0, 0);
      lcd.write(2);  // WiFi icon
      lcd.print(" ");
      lcd.print(WiFi.RSSI());
      lcd.print("dBm");
      
      lcd.setCursor(0, 1);
      lcd.print("Up: ");
      lcd.print(millis() / 60000);
      lcd.print("min");
      break;
  }
  
  // Cycle through display modes
  displayMode = (displayMode + 1) % 3;
}

// ============ Read and Publish Sensors ============
void readAndPublishSensors() {
  // Read DHT sensor
  currentTemp = dht.readTemperature();
  currentHumidity = dht.readHumidity();
  
  // Check if readings are valid
  if (isnan(currentTemp) || isnan(currentHumidity)) {
    Serial.println("⚠️ Failed to read from DHT sensor!");
    
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Sensor Error!");
    lcd.setCursor(0, 1);
    lcd.print("Check DHT11");
    delay(2000);
    
    return;
  }
  
  // Create JSON document
  StaticJsonDocument<512> doc;
  doc["timestamp"] = millis();
  doc["temperature"] = round(currentTemp * 10) / 10.0;  // 1 decimal place
  doc["humidity"] = round(currentHumidity * 10) / 10.0;
  
  // Add device states
  doc["heater"] = heaterState;
  doc["internal_fan"] = internalFanState;
  doc["solar_fans"] = solarFansState;
  doc["solenoid"] = solenoidState;
  doc["solar_inlet_angle"] = solarInletAngle;
  doc["top_vent_angle"] = topVentAngle;
  
  // Add system info
  doc["uptime"] = millis() / 1000;
  doc["rssi"] = WiFi.RSSI();
  doc["free_heap"] = ESP.getFreeHeap();
  
  // Serialize and publish
  char buffer[512];
  serializeJson(doc, buffer);
  
  if (mqtt.publish(TOPIC_SENSORS, buffer)) {
    Serial.println("\n📊 Sensor Data Published:");
    Serial.print("  Temperature: ");
    Serial.print(currentTemp);
    Serial.println("°C");
    Serial.print("  Humidity: ");
    Serial.print(currentHumidity);
    Serial.println("%");
  } else {
    Serial.println("✗ Failed to publish sensor data");
  }
}

// ============ Turn Eggs Function ============
void turnEggs() {
  digitalWrite(STEPPER_ENABLE, LOW);  // Enable stepper
  delay(100);
  
  // Turn 45° left (approximately 100 steps for 1.8° motor)
  digitalWrite(STEPPER_DIR, LOW);
  for (int i = 0; i < 100; i++) {
    digitalWrite(STEPPER_STEP, HIGH);
    delayMicroseconds(1000);
    digitalWrite(STEPPER_STEP, LOW);
    delayMicroseconds(1000);
  }
  
  delay(10000);  // Wait 10 seconds
  
  // Turn 45° right
  digitalWrite(STEPPER_DIR, HIGH);
  for (int i = 0; i < 100; i++) {
    digitalWrite(STEPPER_STEP, HIGH);
    delayMicroseconds(1000);
    digitalWrite(STEPPER_STEP, LOW);
    delayMicroseconds(1000);
  }
  
  digitalWrite(STEPPER_ENABLE, HIGH);  // Disable stepper
}

// ============ Main Loop ============
void loop() {
  // Reconnect WiFi if disconnected
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\n⚠️ WiFi disconnected! Reconnecting...");
    
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi Lost!");
    lcd.setCursor(0, 1);
    lcd.print("Reconnecting...");
    
    connectWiFi();
  }
  
  // Reconnect MQTT if disconnected
  if (!mqtt.connected()) {
    Serial.println("\n⚠️ MQTT disconnected! Reconnecting...");
    
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("MQTT Lost!");
    lcd.setCursor(0, 1);
    lcd.print("Reconnecting...");
    
    connectMQTT();
  }
  
  // Process MQTT messages
  mqtt.loop();
  
  // Read and publish sensors at specified interval
  if (millis() - lastSensorRead >= sensorInterval) {
    lastSensorRead = millis();
    readAndPublishSensors();
  }
  
  // Update LCD display
  if (millis() - lastLCDUpdate >= lcdUpdateInterval) {
    lastLCDUpdate = millis();
    updateLCD();
  }
  
  // Small delay to prevent watchdog timeout
  delay(10);
}