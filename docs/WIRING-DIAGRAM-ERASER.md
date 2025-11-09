# Wiring Diagram - Eraser.io Format

This document contains the ESP32 Solar Egg Incubator system diagram in Eraser.io format.

## How to View This Diagram

1. Go to [eraser.io](https://www.eraser.io/)
2. Create a new diagram
3. Copy the code below and paste it into the Eraser.io editor
4. The diagram will render automatically

---

## ESP32 Incubator System Architecture (Eraser.io Syntax)

```
title ESP32 Solar Egg Incubator System Architecture

// Power System Group
Power System [icon: battery, color: yellow] {
  Solar Inverter [icon: sun]
  Grid Adapter [icon: plug]
  25A Fuse Solar [icon: shield]
  25A Fuse Grid [icon: shield]
  12V 30A Power Relay [icon: switch]
  1000uF Cap 1 [icon: storage]
  1000uF Cap 2 [icon: storage]
  Main 12V Rail [icon: bolt, color: red]
  LM7805 Regulator [icon: chip]
  5V Rail [icon: bolt, color: orange]
}

// ESP32 Core Group
ESP32 Core [icon: cpu, color: blue] {
  ESP32 DevKit [icon: microchip]
  WiFi Module [icon: wifi]
  MQTT Client [icon: network]

  // GPIO Pins as individual nodes
  GPIO4 DHT11 [icon: pin]
  GPIO12 Servo1 [icon: pin]
  GPIO13 Servo2 [icon: pin]
  GPIO14 Solar Fans [icon: pin]
  GPIO18 Stepper STEP [icon: pin]
  GPIO19 Stepper DIR [icon: pin]
  GPIO21 I2C SDA [icon: pin]
  GPIO22 I2C SCL [icon: pin]
  GPIO23 Solenoid [icon: pin]
  GPIO26 Heater [icon: pin]
  GPIO27 Int Fan [icon: pin]
  GPIO32 Stepper EN [icon: pin]
}

// Sensors Group
Sensors [icon: sensor, color: green] {
  DHT11 Sensor [icon: thermometer]
  10K Pullup Resistor [icon: resistor]
  I2C LCD 16x2 [icon: display]
}

// Relays Group
Relay Modules [icon: switch, color: purple] {
  Relay 1 Heater [icon: switch]
  Flyback Diode R1 [icon: diode]
  Relay 2 Int Fan [icon: switch]
  Flyback Diode R2 [icon: diode]
  Relay 3 Solar Fans [icon: switch]
  Flyback Diode R3 [icon: diode]
  Relay 4 Solenoid [icon: switch]
  Flyback Diode R4 [icon: diode]
}

// Heating System Group
Heating System [icon: fire, color: red] {
  Thermal Fuse 77C [icon: shield]
  Soldering Iron Element [icon: heater]
}

// Fans Group
Ventilation Fans [icon: fan, color: cyan] {
  Internal Fan 12V [icon: fan]
  Solar Fan 1 [icon: fan]
  Solar Fan 2 [icon: fan]
  Fan Junction [icon: node]
}

// Servo Motors Group
Servo Motors [icon: motor, color: green] {
  SG90 Solar Inlet [icon: motor]
  SG90 Top Vent [icon: motor]
  Servo Cap 1 [icon: storage]
  Servo Cap 2 [icon: storage]
}

// Stepper System Group
Stepper System [icon: cog, color: purple] {
  A4988 Driver [icon: chip]
  100uF Driver Cap [icon: storage]
  NEMA17 Motor [icon: motor]
}

// Water System Group
Water Control [icon: droplet, color: cyan] {
  Solenoid Valve [icon: valve]
  Solenoid Flyback [icon: diode]
}

// Web Dashboard Group
Web Dashboard [icon: dashboard, color: blue] {
  Next.js App [icon: web]
  Firebase Firestore [icon: database]
  MQTT Broker [icon: server]
}

// Ground Bus
Common Ground [icon: ground, color: gray]


// ============ POWER CONNECTIONS ============

Solar Inverter > 25A Fuse Solar : 12V DC
Grid Adapter > 25A Fuse Grid : 12V DC
25A Fuse Solar > 12V 30A Power Relay : Switched
25A Fuse Grid > 12V 30A Power Relay : Backup
12V 30A Power Relay > 1000uF Cap 1 : Filtered
1000uF Cap 1 > 1000uF Cap 2 : Parallel
1000uF Cap 2 > Main 12V Rail : Main Power

Main 12V Rail > LM7805 Regulator : 12V Input
LM7805 Regulator > 5V Rail : 5V Output
5V Rail > ESP32 DevKit : Power
Main 12V Rail > A4988 Driver : VMOT
5V Rail > A4988 Driver : VDD Logic


// ============ ESP32 GPIO CONNECTIONS ============

ESP32 DevKit <> WiFi Module : Internal
WiFi Module <> MQTT Client : Network

ESP32 DevKit > GPIO4 DHT11 : Data Pin
ESP32 DevKit > GPIO12 Servo1 : PWM Signal
ESP32 DevKit > GPIO13 Servo2 : PWM Signal
ESP32 DevKit > GPIO14 Solar Fans : Relay Control
ESP32 DevKit > GPIO18 Stepper STEP : Step Pulses
ESP32 DevKit > GPIO19 Stepper DIR : Direction
ESP32 DevKit > GPIO21 I2C SDA : I2C Data
ESP32 DevKit > GPIO22 I2C SCL : I2C Clock
ESP32 DevKit > GPIO23 Solenoid : Relay Control
ESP32 DevKit > GPIO26 Heater : Relay Control PWM
ESP32 DevKit > GPIO27 Int Fan : Relay Control
ESP32 DevKit > GPIO32 Stepper EN : Enable Signal


// ============ SENSOR CONNECTIONS ============

GPIO4 DHT11 > DHT11 Sensor : Data Line
10K Pullup Resistor < DHT11 Sensor : Pull-up to 3.3V
DHT11 Sensor > Common Ground : Sensor GND

GPIO21 I2C SDA > I2C LCD 16x2 : SDA Line
GPIO22 I2C SCL > I2C LCD 16x2 : SCL Line
5V Rail > I2C LCD 16x2 : LCD Power
I2C LCD 16x2 > Common Ground : LCD GND


// ============ RELAY MODULE CONNECTIONS ============

5V Rail > Relay 1 Heater : Coil Power
5V Rail > Relay 2 Int Fan : Coil Power
5V Rail > Relay 3 Solar Fans : Coil Power
5V Rail > Relay 4 Solenoid : Coil Power

GPIO26 Heater > Relay 1 Heater : Control Signal
GPIO27 Int Fan > Relay 2 Int Fan : Control Signal
GPIO14 Solar Fans > Relay 3 Solar Fans : Control Signal
GPIO23 Solenoid > Relay 4 Solenoid : Control Signal

Flyback Diode R1 <> Relay 1 Heater : Protection
Flyback Diode R2 <> Relay 2 Int Fan : Protection
Flyback Diode R3 <> Relay 3 Solar Fans : Protection
Flyback Diode R4 <> Relay 4 Solenoid : Protection


// ============ HEATING SYSTEM ============

Main 12V Rail > Relay 1 Heater : COM Terminal
Relay 1 Heater > Thermal Fuse 77C : NO Terminal (switched)
Thermal Fuse 77C > Soldering Iron Element : Safety cutoff
Soldering Iron Element > Common Ground : Heater return


// ============ FAN SYSTEMS ============

Main 12V Rail > Relay 2 Int Fan : COM Terminal
Relay 2 Int Fan > Internal Fan 12V : NO Terminal
Internal Fan 12V > Common Ground : Fan return

Main 12V Rail > Relay 3 Solar Fans : COM Terminal
Relay 3 Solar Fans > Fan Junction : NO Terminal
Fan Junction > Solar Fan 1 : Parallel
Fan Junction > Solar Fan 2 : Parallel
Solar Fan 1 > Common Ground : Fan 1 return
Solar Fan 2 > Common Ground : Fan 2 return


// ============ SERVO MOTORS ============

5V Rail > Servo Cap 1 : Power filtering
Servo Cap 1 > SG90 Solar Inlet : Servo power
GPIO12 Servo1 > SG90 Solar Inlet : PWM control
SG90 Solar Inlet > Common Ground : Servo GND

5V Rail > Servo Cap 2 : Power filtering
Servo Cap 2 > SG90 Top Vent : Servo power
GPIO13 Servo2 > SG90 Top Vent : PWM control
SG90 Top Vent > Common Ground : Servo GND


// ============ STEPPER MOTOR SYSTEM ============

GPIO18 Stepper STEP > A4988 Driver : Step pulses
GPIO19 Stepper DIR > A4988 Driver : Direction control
GPIO32 Stepper EN > A4988 Driver : Enable signal
Main 12V Rail > 100uF Driver Cap : Motor power
100uF Driver Cap > A4988 Driver : VMOT filtered
A4988 Driver > NEMA17 Motor : 4-wire coil connection
NEMA17 Motor > Common Ground : Motor return


// ============ WATER CONTROL ============

Main 12V Rail > Relay 4 Solenoid : COM Terminal
Relay 4 Solenoid > Solenoid Valve : NO Terminal
Solenoid Flyback <> Solenoid Valve : Inductive protection
Solenoid Valve > Common Ground : Valve return


// ============ WEB DASHBOARD ============

MQTT Client <> MQTT Broker : Publish/Subscribe
MQTT Broker <> Next.js App : WebSocket 8083
Next.js App <> Firebase Firestore : Data storage


// ============ GROUND CONNECTIONS ============

Solar Inverter > Common Ground : GND
Grid Adapter > Common Ground : GND
ESP32 DevKit > Common Ground : ESP32 GND
Relay Modules > Common Ground : Relay GND
Sensors > Common Ground : Sensor GND
Heating System > Common Ground : Heater return
Ventilation Fans > Common Ground : Fan returns
Servo Motors > Common Ground : Servo GND
Stepper System > Common Ground : Motor return
Water Control > Common Ground : Valve return
```

---

## Simplified View - User and Data Flow (Eraser.io)

```
title Incubator User and Data Flow

// User Interface
User [icon: user]

// Frontend
Dashboard Interface [icon: dashboard, color: blue] {
  Web Browser [icon: web]
  Mobile Browser [icon: phone]
}

// Backend Services
Cloud Services [icon: cloud, color: purple] {
  MQTT Broker HiveMQ [icon: server]
  Firebase Firestore [icon: database]
  Next.js Server [icon: web]
}

// Hardware
ESP32 Hardware [icon: microchip, color: blue] {
  ESP32 Controller [icon: cpu]
  DHT11 Sensor [icon: thermometer]
  LCD Display [icon: display]
  Relays [icon: switch]
  Servos [icon: motor]
  Stepper Motor [icon: cog]
}

// Physical Actuators
Physical Systems [icon: cog, color: orange] {
  Heater Element [icon: fire]
  Circulation Fans [icon: fan]
  Solenoid Valve [icon: droplet]
  Egg Tray [icon: box]
}

// Eggs
Incubator Chamber [icon: box, color: yellow] {
  30 Chicken Eggs [icon: egg]
  Temperature 37.5C [icon: thermometer]
  Humidity 50-80% [icon: droplet]
}


// ============ USER INTERACTIONS ============

User > Web Browser : Access dashboard
User > Mobile Browser : Mobile access

Web Browser > Next.js Server : HTTPS request
Mobile Browser > Next.js Server : HTTPS request


// ============ DASHBOARD CONNECTIONS ============

Next.js Server <> MQTT Broker HiveMQ : WebSocket 8083 (bidirectional)
Next.js Server <> Firebase Firestore : Store historical data
Web Browser <> Next.js Server : Real-time updates


// ============ MQTT COMMUNICATIONS ============

ESP32 Controller <> MQTT Broker HiveMQ : MQTT TCP 1883
MQTT Broker HiveMQ > Next.js Server : incubator/esp32/sensors (publish)
MQTT Broker HiveMQ > Next.js Server : incubator/esp32/status (publish)
Next.js Server > MQTT Broker HiveMQ : incubator/esp32/control (publish)
MQTT Broker HiveMQ > ESP32 Controller : incubator/esp32/control (subscribe)


// ============ HARDWARE OPERATIONS ============

ESP32 Controller > DHT11 Sensor : Read temp/humidity every 5s
DHT11 Sensor > ESP32 Controller : Return sensor data
ESP32 Controller > LCD Display : Update display every 2s
ESP32 Controller > Relays : Digital ON/OFF control
ESP32 Controller > Servos : PWM angle control 0-180deg
ESP32 Controller > Stepper Motor : Step/Dir pulses for rotation


// ============ ACTUATOR CONTROL ============

Relays > Heater Element : 12V switched power
Relays > Circulation Fans : 12V switched power
Relays > Solenoid Valve : 12V pulsed (2-3 sec)
Stepper Motor > Egg Tray : Rotate 45deg every 4 hours


// ============ ENVIRONMENTAL CONTROL ============

Heater Element > Incubator Chamber : Heat to 37.5C
Circulation Fans > Incubator Chamber : Air circulation
Solenoid Valve > Incubator Chamber : Add humidity
Egg Tray > 30 Chicken Eggs : Turn eggs 6x per day


// ============ DATA FLOW ============

Incubator Chamber > DHT11 Sensor : Environmental conditions
DHT11 Sensor > ESP32 Controller : Sensor readings
ESP32 Controller > MQTT Broker HiveMQ : Publish data JSON
MQTT Broker HiveMQ > Next.js Server : Forward to dashboard
Next.js Server > Firebase Firestore : Auto-save every 30s
Firebase Firestore > Next.js Server : Historical data queries
Next.js Server > Web Browser : Real-time display updates
```

---

## Pin-Level Wiring Diagram (Eraser.io)

```
title ESP32 Pin-Level Wiring Details

// ESP32 Pins (Individual Nodes)
ESP32 Pins [icon: microchip, color: blue] {
  Pin EN [icon: pin]
  Pin 3V3 Out [icon: pin, color: orange]
  Pin GND 1 [icon: pin, color: gray]
  Pin GPIO4 [icon: pin, color: green]
  Pin GPIO12 [icon: pin, color: purple]
  Pin GPIO13 [icon: pin, color: purple]
  Pin GPIO14 [icon: pin, color: red]
  Pin GPIO18 [icon: pin, color: yellow]
  Pin GPIO19 [icon: pin, color: yellow]
  Pin GPIO21 [icon: pin, color: pink]
  Pin GPIO22 [icon: pin, color: pink]
  Pin GPIO23 [icon: pin, color: cyan]
  Pin GPIO26 [icon: pin, color: red]
  Pin GPIO27 [icon: pin, color: blue]
  Pin GPIO32 [icon: pin, color: yellow]
  Pin 5V In [icon: pin, color: red]
  Pin GND 2 [icon: pin, color: gray]
}

// External Components
External Components {
  DHT11 VCC [icon: power]
  DHT11 Data [icon: signal]
  DHT11 GND [icon: ground]

  LCD VCC [icon: power]
  LCD SDA [icon: signal]
  LCD SCL [icon: signal]
  LCD GND [icon: ground]

  Relay1 Coil Neg [icon: switch]
  Relay2 Coil Neg [icon: switch]
  Relay3 Coil Neg [icon: switch]
  Relay4 Coil Neg [icon: switch]

  Servo1 Signal [icon: motor]
  Servo2 Signal [icon: motor]

  A4988 STEP [icon: chip]
  A4988 DIR [icon: chip]
  A4988 ENABLE [icon: chip]
}

// Power Rails
Power Rails {
  Main 5V Rail [icon: bolt, color: orange]
  Main 3V3 Rail [icon: bolt, color: yellow]
  Ground Bus [icon: ground, color: gray]
}


// ============ POWER RAIL CONNECTIONS ============

Main 5V Rail > Pin 5V In : ESP32 power input
Pin 3V3 Out > Main 3V3 Rail : 3.3V output from ESP32
Pin GND 1 > Ground Bus : Ground connection 1
Pin GND 2 > Ground Bus : Ground connection 2


// ============ DHT11 SENSOR WIRING ============

Main 3V3 Rail > DHT11 VCC : 3.3V power (NOT 5V!)
Pin GPIO4 > DHT11 Data : Temperature/Humidity data
DHT11 Data > Main 3V3 Rail : 10K pullup resistor required
DHT11 GND > Ground Bus : Sensor ground


// ============ LCD DISPLAY WIRING ============

Main 5V Rail > LCD VCC : 5V power for LCD
Pin GPIO21 > LCD SDA : I2C data line
Pin GPIO22 > LCD SCL : I2C clock line
LCD GND > Ground Bus : LCD ground


// ============ RELAY CONTROL PINS ============

Pin GPIO26 > Relay1 Coil Neg : Heater relay control
Pin GPIO27 > Relay2 Coil Neg : Internal fan relay control
Pin GPIO14 > Relay3 Coil Neg : Solar fans relay control
Pin GPIO23 > Relay4 Coil Neg : Solenoid relay control

Main 5V Rail > Relay1 Coil Neg : All relay coils powered by 5V
Main 5V Rail > Relay2 Coil Neg : Flyback diode protection required
Main 5V Rail > Relay3 Coil Neg : on each relay coil
Main 5V Rail > Relay4 Coil Neg : (cathode to +, anode to GPIO)


// ============ SERVO MOTOR CONTROL ============

Pin GPIO12 > Servo1 Signal : Solar inlet flap servo PWM
Pin GPIO13 > Servo2 Signal : Top vent servo PWM

Main 5V Rail > Servo1 Signal : Servo power (red wire)
Main 5V Rail > Servo2 Signal : 100uF cap across power pins
Servo1 Signal > Ground Bus : Servo ground (brown wire)
Servo2 Signal > Ground Bus : Servo ground (brown wire)


// ============ STEPPER DRIVER CONTROL ============

Pin GPIO18 > A4988 STEP : Step pulse train
Pin GPIO19 > A4988 DIR : Direction control
Pin GPIO32 > A4988 ENABLE : Enable (LOW=on, HIGH=off)

Main 5V Rail > A4988 STEP : A4988 VDD logic power
A4988 DIR > Ground Bus : A4988 GND
```

---

## Component Specifications (Eraser.io Reference)

```
title Component Specifications and Ratings

// Core Components
Core Electronics [icon: chip, color: blue] {
  ESP32 DevKit Node MCU [icon: microchip]
  LM7805 5V Regulator [icon: chip]
  DHT11 Sensor [icon: thermometer]
  LCD 16x2 I2C [icon: display]
}

// Power Components
Power System [icon: battery, color: yellow] {
  Solar Inverter 12V [icon: sun]
  Grid Adapter 12V 5A [icon: plug]
  Fuse 25A Blade x2 [icon: shield]
  Relay 12V 30A SL-C [icon: switch]
  Cap 1000uF 16V x2 [icon: storage]
}

// Switching Components
Relays and Protection [icon: switch, color: purple] {
  JQC3F Relay 5V x4 [icon: switch]
  Diode 1N4007 x6 [icon: diode]
  Thermal Fuse 77C [icon: shield]
}

// Actuators
Actuators [icon: motor, color: red] {
  Heater 40-60W 12V [icon: fire]
  Fan 12V 0.2A x3 [icon: fan]
  SG90 Servo x2 [icon: motor]
  NEMA17 1.8deg [icon: cog]
  A4988 Driver [icon: chip]
  Solenoid 12V 1/4in [icon: droplet]
}

// Passive Components
Passive Parts [icon: resistor, color: green] {
  Resistor 10K x1 [icon: resistor]
  Resistor 1K x1 [icon: resistor]
  Cap 100uF 16V x4 [icon: storage]
  Transistor 2N2222 x1 [icon: chip]
}

// Wiring
Wire and Connectors [icon: cable, color: gray] {
  Wire 14 AWG Ground [icon: cable]
  Wire 16 AWG Power [icon: cable]
  Wire 18 AWG Heater [icon: cable]
  Wire 20-22 AWG Loads [icon: cable]
  Wire 22-24 AWG Signals [icon: cable]
}


// ============ SPECIFICATIONS ============

ESP32 DevKit Node MCU : CPU Dual-core 240MHz, WiFi 802.11bgn, BT 4.2, 34 GPIO, 3.3V logic
LM7805 5V Regulator : Input 7-35V, Output 5V 1A max, TO-220 package
DHT11 Sensor : Range 0-50C ±2C, 20-80% RH ±5%, 3.3V operation, 2s min interval
LCD 16x2 I2C : Address 0x27 or 0x3F, 5V power, Blue backlight, I2C interface

Solar Inverter 12V : 12V DC output, Min 3A continuous for system
Grid Adapter 12V 5A : 12V DC 5A power adapter, barrel jack or terminal
Fuse 25A Blade x2 : Automotive blade fuse 25A rating, inline holders
Relay 12V 30A SL-C : 12V coil 30A contacts, automotive power relay
Cap 1000uF 16V x2 : Electrolytic 1000uF 16V, Low ESR, radial leads

JQC3F Relay 5V x4 : 5V coil 250V AC 10A contacts, SPDT normally open
Diode 1N4007 x6 : 1A 1000V rectifier diode, flyback protection
Thermal Fuse 77C : 77C cutoff 10A rating, one-time use safety device

Heater 40-60W 12V : Soldering iron element 40-60W at 12V, max 5A draw
Fan 12V 0.2A x3 : 60mm DC fan 12V 0.2A, 3-pin or 2-pin, 2000-3000 RPM
SG90 Servo x2 : 180deg rotation, 4.8-6V operation, 100-200mA peak
NEMA17 1.8deg : Bipolar stepper 1.8deg/step 200steps/rev, 1.5A rated
A4988 Driver : Stepper driver 8-35V 2A, microstepping up to 1/16
Solenoid 12V 1/4in : Normally closed 12V DC 1/4 inch NPT water valve

Resistor 10K x1 : 1/4W 10K ohm carbon film, ±5%, DHT11 pullup
Resistor 1K x1 : 1/4W 1K ohm carbon film, ±5%, relay transistor base
Cap 100uF 16V x4 : Electrolytic 100uF 16V, servo and driver decoupling
Transistor 2N2222 x1 : NPN 40V 800mA, power relay switching

Wire 14 AWG Ground : Solid copper 14 AWG black or bare, ground bus bar
Wire 16 AWG Power : Stranded 16 AWG red/black, main 12V power rails
Wire 18 AWG Heater : Stranded 18 AWG red/black, heater circuit only
Wire 20-22 AWG Loads : Stranded 20-22 AWG various, fan/solenoid circuits
Wire 22-24 AWG Signals : Solid or stranded 22-24 AWG, GPIO and I2C signals
```

---

## How to Use These Eraser.io Diagrams

1. **Copy** any of the code blocks above
2. **Go to** [eraser.io](https://www.eraser.io/)
3. **Create a new diagram**
4. **Paste** the code into the editor
5. **The diagram renders automatically** with proper icons, colors, and relationships

### Eraser.io Features Used
- `[icon: name]` - Adds visual icons to components
- `[color: name]` - Color codes component groups
- `{  }` - Creates grouped containers
- `>` - One-way connection (arrow)
- `<>` - Two-way connection (bidirectional)
- `:` - Connection labels (descriptive text)

### Customization
You can edit the diagrams in Eraser.io to:
- Change colors and icons
- Reorganize component layouts
- Add or remove connections
- Adjust labels and descriptions
- Export as PNG, SVG, or PDF

---

**For other diagram formats, see:**
- Mermaid.js diagrams: [WIRING-DIAGRAM-MERMAID.md](./WIRING-DIAGRAM-MERMAID.md)
- ASCII text diagrams: [WIRING-DIAGRAM-TEXT.md](./WIRING-DIAGRAM-TEXT.md)
