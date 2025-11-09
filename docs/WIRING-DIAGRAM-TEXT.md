# Wiring Diagram - ASCII Text Format

Complete wiring diagrams in ASCII art format for the ESP32 Solar Egg Incubator system.

## Complete System Overview

```
═══════════════════════════════════════════════════════════════════════════════════
                     ESP32 SOLAR EGG INCUBATOR WIRING DIAGRAM
═══════════════════════════════════════════════════════════════════════════════════

POWER SYSTEM
════════════════════════════════════════════════════════════════════════════════

Solar Inverter (12V)          Grid Adapter (12V)
       |                              |
       | +12V                         | +12V
       |                              |
    ┌──┴──┐                        ┌──┴──┐
    │25A  │                        │25A  │
    │Fuse │                        │Fuse │
    └──┬──┘                        └──┬──┘
       |                              |
       └───────────┐         ┌────────┘
                   |         |
              ┌────┴─────────┴────┐
              │ 12V 30A SL-C Relay│
              │  Power Switching  │
              └─────────┬──────────┘
                        |
                 ┌──────┴──────┐
                 │  1000µF Cap │ ─── Parallel ─── 1000µF Cap
                 └──────┬──────┘
                        |
                 ═══════╪═══════  Main 12V Rail (16 AWG)
                        |
           ┌────────────┼────────────┐
           |            |            |
      To Relays   To A4988 Driver  To Regulator
                                     |
                              ┌──────┴──────┐
                              │   LM7805 or  │
                              │ Buck Converter│
                              │   12V → 5V   │
                              └──────┬──────┘
                                     |
                              ═══════╪═══════  5V Rail
                                     |
                        ┌────────────┼────────────┐
                        |            |            |
                   To ESP32     To Servos    To Relays (Coils)


Common Ground Bus (14 AWG thick wire)
═══════════════════════════════════════════════════════════════════
All GND connections → Solar GND, Grid GND, All Components
```

## ESP32 DevKit Pinout with Connections

```
════════════════════════════════════════════════════════════════════════════
                          ESP32 DEVKIT PINOUT
════════════════════════════════════════════════════════════════════════════

       ┌────────────────────────────────────────┐
       │                                        │
  EN   │●                                    ●  │ GPIO23 → Relay #4 (Solenoid)
VP(36) │●                                    ●  │ GPIO22 → LCD SCL (I2C)
VN(39) │●                                    ●  │ TX(1)
GPIO34 │●                                    ●  │ RX(3)
GPIO35 │●        ┌────────────┐             ●  │ GPIO21 → LCD SDA (I2C)
GPIO32 │●────────┤ ESP32 DEV  ├─────────────●  │ GPIO19 → A4988 DIR
GPIO33 │●        │  MODULE    │             ●  │ GPIO18 → A4988 STEP
GPIO25 │●        │            │             ●  │ GPIO5
GPIO26 │●────────┤            ├─────────────●  │ GPIO17
GPIO27 │●        │   WiFi+BT  │             ●  │ GPIO16
GPIO14 │●────────┤            ├─────────────●  │ GPIO4  → DHT11 Data
GPIO12 │●        │            │             ●  │ GPIO0
GPIO13 │●        └────────────┘             ●  │ GPIO2
 GND   │●                                    ●  │ GPIO15
 VIN   │●                                    ●  │ GND
       │                                        │ 3.3V → DHT11 VCC
       └────────────────────────────────────────┘

GPIO Legend:
═══════════
GPIO4  → DHT11 Temperature/Humidity Data (with 10kΩ pull-up to 3.3V)
GPIO12 → Servo #1 PWM (Solar Inlet Flap)
GPIO13 → Servo #2 PWM (Top Vent)
GPIO14 → Relay #3 Control (Solar Fans)
GPIO18 → A4988 STEP (Stepper Motor)
GPIO19 → A4988 DIR (Stepper Direction)
GPIO21 → I2C SDA (LCD Display)
GPIO22 → I2C SCL (LCD Display)
GPIO23 → Relay #4 Control (Solenoid Valve)
GPIO26 → Relay #1 Control (Heater)
GPIO27 → Relay #2 Control (Internal Fan)
GPIO32 → A4988 ENABLE (Stepper Enable)
```

## Relay Module Wiring (Pattern for all 4 relays)

```
════════════════════════════════════════════════════════════════════════════
                      RELAY MODULE WIRING PATTERN
════════════════════════════════════════════════════════════════════════════

        5V Rail                                 Main 12V Rail
           |                                          |
           |  ┌─────────────────────┐                |
           └──┤ Coil +              │                |
              │                     │                |
ESP32 GPIO────┤ Coil -        COM ──┼────────────────┘
     (Control)│                     │
              │  JQC3F-05VDC-C      │
           ┌──┤ (5V Relay)      NO ─┼────┬──→ Load Device
           │  │                     │    │    (Heater/Fan/Solenoid)
        ┌──┴──┴┐                    │    │
        │1N4007│                    │    └──→ Load GND
        │Diode │               NC ──┘         (to Ground Bus)
        └──────┘
      (Flyback Protection)
       Cathode to Coil +
       Anode to GPIO


Relay Assignments:
══════════════════
┌──────────┬─────────┬──────────────────────┬────────────────┐
│ Relay #  │  GPIO   │      Load Device     │   Wire Gauge   │
├──────────┼─────────┼──────────────────────┼────────────────┤
│ Relay #1 │ GPIO26  │ Heater Element       │ 18 AWG         │
│ Relay #2 │ GPIO27  │ Internal Fan         │ 20-22 AWG      │
│ Relay #3 │ GPIO14  │ Solar Fans (2×)      │ 20-22 AWG      │
│ Relay #4 │ GPIO23  │ Solenoid Valve       │ 20-22 AWG      │
└──────────┴─────────┴──────────────────────┴────────────────┘
```

## Heater Circuit with Thermal Fuse

```
════════════════════════════════════════════════════════════════════════════
                      HEATER CIRCUIT (SAFETY CRITICAL)
════════════════════════════════════════════════════════════════════════════

Main 12V Rail ─────┐
                   │
              ┌────┴────┐
              │ Relay #1│
              │  COM    │
              └────┬────┘
                   │ NO (Normally Open)
                   │
              ┌────┴────┐
              │ 77°C    │  ◄─── MANDATORY THERMAL FUSE
              │Thermal  │        (Safety Cutoff)
              │ Fuse    │
              └────┬────┘
                   │
              ┌────┴────────┐
              │ Soldering   │
              │ Iron Element│  40-60W @ 12V (max 5A)
              │ 12V Heater  │
              └────┬────────┘
                   │
                   └─────────► Ground Bus


⚠️  CRITICAL SAFETY REQUIREMENTS:
    • 77°C thermal fuse is MANDATORY
    • Use 18 AWG wire minimum
    • Heater must be ≤60W @ 12V
    • Install in well-ventilated enclosure
    • Test thermal fuse before operation
```

## Fan Circuits

```
════════════════════════════════════════════════════════════════════════════
                            FAN CIRCUITS
════════════════════════════════════════════════════════════════════════════

INTERNAL FAN (Single 12V Fan)
──────────────────────────────────────
Main 12V Rail ───┐
                 │
            ┌────┴────┐
            │ Relay #2│
            │  COM    │
            └────┬────┘
                 │ NO
                 │
            ┌────┴────┐
            │  12V DC │
            │   Fan   │  60mm, 0.2A
            │ Internal│
            └────┬────┘
                 │
                 └───────► Ground Bus


SOLAR FANS (2× Fans in Parallel)
──────────────────────────────────────────────────────────
Main 12V Rail ───┐
                 │
            ┌────┴────┐
            │ Relay #3│
            │  COM    │
            └────┬────┘
                 │ NO
                 │
            ┌────┴────┐  Junction (Wire Nut)
            │    +    │
            └──┬───┬──┘
               |   |
        ┌──────┘   └──────┐
        |                 |
   ┌────┴────┐       ┌────┴────┐
   │ Solar   │       │ Solar   │
   │ Fan #1  │       │ Fan #2  │  Both 12V, 0.2A
   │ 60mm    │       │ 60mm    │
   └────┬────┘       └────┬────┘
        |                 |
        └────────┬────────┘
                 |
                 └───────────────► Ground Bus

Note: Parallel = Each fan gets full 12V, combined current = 0.4A
```

## Servo Motor Wiring

```
════════════════════════════════════════════════════════════════════════════
                        SERVO MOTOR WIRING (SG90)
════════════════════════════════════════════════════════════════════════════

SERVO #1 - Solar Inlet Flap (GPIO12)
────────────────────────────────────────────────────
         5V Rail ───┐
                    │
               ┌────┴────┐
               │  100µF  │  Decoupling Capacitor
               │   Cap   │  (Prevents voltage dips)
               └────┬────┘
                    │
         ┌──────────┴──────────┐
         │    RED (Power)      │
         │                     │
ESP32 ───┤  ORANGE (Signal)    │  SG90 Servo
GPIO12   │                     │  (Solar Inlet Flap)
         │   BROWN (Ground)    │
         └─────────────────────┘
                    │
              Ground Bus


SERVO #2 - Top Vent (GPIO13)
─────────────────────────────────────────────────────
         5V Rail ───┐
                    │
               ┌────┴────┐
               │  100µF  │  Decoupling Capacitor
               │   Cap   │
               └────┬────┘
                    │
         ┌──────────┴──────────┐
         │    RED (Power)      │
         │                     │
ESP32 ───┤  ORANGE (Signal)    │  SG90 Servo
GPIO13   │                     │  (Top Vent Control)
         │   BROWN (Ground)    │
         └─────────────────────┘
                    │
              Ground Bus


Servo PWM Parameters:
══════════════════════
• Frequency: 50 Hz (20ms period)
• Pulse Width: 1ms = 0°, 1.5ms = 90°, 2ms = 180°
• Power Consumption: 100-200mA during movement
• Operating Voltage: 4.8-6V (5V nominal)
```

## A4988 Stepper Driver Wiring

```
════════════════════════════════════════════════════════════════════════════
                  A4988 STEPPER DRIVER + NEMA17 WIRING
════════════════════════════════════════════════════════════════════════════

Main 12V Rail ─────┐                5V Rail ───┐
                   │                            │
              ┌────┴────┐                       │
              │  100µF  │  Decoupling           │
              │   Cap   │  Capacitor            │
              └────┬────┘                       │
                   │                            │
        ╔══════════╧════════════════════════════╧═══════╗
        ║         VMOT              VDD                 ║
        ║   (Motor Power)      (Logic Power)           ║
        ║                                               ║
ESP32 ──╢ STEP  ◄─ GPIO18    (Pulse train for steps)  ║
GPIO18  ║                                               ║
        ║ DIR   ◄─ GPIO19    (Rotation direction)      ║
ESP32 ──╢                                               ║
GPIO19  ║ ENABLE◄─ GPIO32    (LOW=enabled, HIGH=off)   ║
        ║                                               ║
ESP32 ──╢ RESET ─┐                                      ║
GPIO32  ║        ├── Tie together for normal operation ║
        ║ SLEEP ─┘                                      ║
        ║                                               ║
        ║ MS1, MS2, MS3 ─── GND (Full Step Mode)       ║
        ║                   or configure for microstep ║
        ║                                               ║
        ║         MOTOR OUTPUTS                         ║
        ║                                               ║
        ║ 1B ──────────────────────┐                   ║
        ║ 1A ──────────────────┐   │                   ║
        ║ 2B ──────────┐       │   │                   ║
        ║ 2A ──────┐   │       │   │                   ║
        ║ GND ───  │   │       │   │                   ║
        ╚══════╪═══╧═══╧═══════╧═══╧═══════════════════╝
               │   │   │       │   │
          Ground   │   │       │   │
           Bus     │   │       │   │
                   │   │       │   │
              ┌────┴───┴───────┴───┴────┐
              │  NEMA17 Stepper Motor   │
              │      1.8° per step       │
              │                          │
              │  Coil A: 1B(+) / 1A(-)  │  RED / GREEN wires
              │  Coil B: 2B(+) / 2A(-)  │  BLUE / YELLOW wires
              │                          │
              └──────────────────────────┘


Current Adjustment (Important!):
═════════════════════════════════
Use ceramic screwdriver to adjust potentiometer on A4988:
• Measure voltage between POT wiper and GND
• For 1.5A NEMA17: Set Vref = 0.6V
• Formula: Vref = Current_Limit / 2.5
• Example: 1.5A / 2.5 = 0.6V
```

## DHT11 Sensor Wiring

```
════════════════════════════════════════════════════════════════════════════
               DHT11 TEMPERATURE & HUMIDITY SENSOR
════════════════════════════════════════════════════════════════════════════

ESP32 3.3V Pin ───┬──────────────────────┐
                  │                      │
                  │               ┌──────┴──────┐
                  │               │    10kΩ     │  Pull-up Resistor
                  │               │  Resistor   │  (REQUIRED)
                  │               └──────┬──────┘
                  │                      │
         ┌────────┴──────────────────────┴───────┐
         │       VCC            DATA             │
         │        +              │               │
         │       ┌───────────────┴───┐           │
         │       │   DHT11 Sensor    │           │
         │       │  Temp & Humidity  │           │
         │       └───────────────────┘           │
         │                                        │
ESP32 ───┤                                        │
GPIO4    │                                        │
         │        GND            NC               │
         └─────────┬──────────────────────────────┘
                   │              (Not Connected)
              Ground Bus


Pin Configuration:
══════════════════
Pin 1: VCC   → ESP32 3.3V (NOT 5V!)
Pin 2: DATA  → ESP32 GPIO4 (with 10kΩ pull-up to 3.3V)
Pin 3: NC    → Not Connected
Pin 4: GND   → Ground Bus


⚠️  Important Notes:
    • DHT11 operates at 3.3V (NOT 5V)
    • 10kΩ pull-up resistor to VCC is MANDATORY
    • Reading interval: minimum 2 seconds
    • Accuracy: ±2°C, ±5% RH
```

## I2C LCD 16x2 Wiring

```
════════════════════════════════════════════════════════════════════════════
                     I2C LCD 16x2 DISPLAY MODULE
════════════════════════════════════════════════════════════════════════════

5V Rail ───┐
           │
    ┌──────┴──────┐
    │     VCC     │
    │             │
    │   ┌─────────────────────────────┐
    │   │  I2C LCD 16x2 Module        │
ESP32   │                             │
GPIO21──┤  SDA  (I2C Data Line)       │
        │                             │
ESP32   │  SCL  (I2C Clock Line)      │
GPIO22──┤                             │
        │                             │
        │  I2C Address: 0x27 or 0x3F  │
        │  (Scan with I2C scanner     │
        │   if display doesn't work)  │
        └─────────────────────────────┘
    │     GND     │
    └──────┬──────┘
           │
      Ground Bus


I2C Specifications:
═══════════════════
• I2C Address: 0x27 (most common) or 0x3F
• Display Size: 16 characters × 2 lines
• Backlight: Blue (configurable in code)
• Logic Level: 3.3V tolerant (built-in level shifters)
• Power: 5V required for backlight
• No pull-up resistors needed (built into module)


Test I2C Address (Arduino Code):
═════════════════════════════════
#include <Wire.h>
void setup() {
  Wire.begin();
  Serial.begin(115200);
  Serial.println("I2C Scanner");
  for(byte address = 1; address < 127; address++ ) {
    Wire.beginTransmission(address);
    if (Wire.endTransmission() == 0) {
      Serial.print("I2C device at 0x");
      Serial.println(address,HEX);
    }
  }
}
void loop() {}
```

## Solenoid Valve with Protection

```
════════════════════════════════════════════════════════════════════════════
                 SOLENOID VALVE CIRCUIT (Water Control)
════════════════════════════════════════════════════════════════════════════

Main 12V Rail ─────┐
                   │
              ┌────┴────┐
              │ Relay #4│
              │  COM    │
              └────┬────┘
                   │ NO
                   │
              ┌────┴────┐  RED Wire (+)
              │         │
              │  12V    │
              │Solenoid │  1/4" valve for water release
              │ Valve   │  Normally Closed (NC)
              │         │
              └────┬────┘  BLACK Wire (-)
                   │
           ┌───────┴───────┐
           │    1N4007     │  ◄─── FLYBACK DIODE (MANDATORY)
           │     Diode     │        Cathode to +, Anode to -
           └───────────────┘        (Inductive kickback protection)
                   │
                   └────────────► Ground Bus


Operation:
══════════
• GPIO23 HIGH → Relay closes → Solenoid opens → Water flows
• Pulse for 2-3 seconds to release measured water
• Inductive load REQUIRES flyback diode
• Typical current: 200-300mA @ 12V
• Flow rate: ~1-2 L/min (depends on valve model)


Control Logic (in Arduino):
════════════════════════════
if (humidity < 50%) {
  digitalWrite(RELAY_SOLENOID, HIGH);  // Open valve
  delay(2000);                         // 2 seconds
  digitalWrite(RELAY_SOLENOID, LOW);   // Close valve
}
```

## Ground Bus Configuration

```
════════════════════════════════════════════════════════════════════════════
                        COMMON GROUND BUS WIRING
════════════════════════════════════════════════════════════════════════════

                     ╔═══════════════════════════╗
                     ║  COMMON GROUND BUS BAR    ║
                     ║  (14 AWG thick wire or    ║
                     ║   copper bus bar)         ║
                     ╚═══════════════════════════╝
                              │││││││││││
      ┌───────────────────────┴┴┴┴┴┴┴┴┴┴┴───────────────────────┐
      │       │       │       │       │       │       │          │
    Solar   Grid   ESP32   All 4   DHT11   LCD    Servos    Stepper
     GND     GND     GND   Relays   GND     GND    GND       Motor
                           GND                               GND
                           ↓
                     Heater, Fans,
                     Solenoid Valve
                     return paths


Ground Bus Requirements:
════════════════════════
• Wire Gauge: 14 AWG minimum (or copper bus bar)
• Material: Solid core copper wire or bus bar
• Length: Keep as short as possible
• Connections: Use terminal blocks or wire nuts
• Testing: Verify <0.1Ω resistance between any two ground points


⚠️  Critical: ALL ground returns must connect to single point
    to avoid ground loops and voltage differentials.
```

## Wire Gauge Reference Table

```
═══════════════════════════════════════════════════════════════════════════
                         WIRE GAUGE REFERENCE
═══════════════════════════════════════════════════════════════════════════

┌──────────────────┬────────────┬─────────────┬──────────────┬──────────┐
│  Circuit Path    │ Wire Gauge │ Max Current │ Color Code   │ Notes    │
├──────────────────┼────────────┼─────────────┼──────────────┼──────────┤
│ Main 12V Rails   │  16 AWG    │    10A      │ Red (+)      │ Thick    │
│                  │            │             │ Black (-)    │ stranded │
├──────────────────┼────────────┼─────────────┼──────────────┼──────────┤
│ Heater Circuit   │  18 AWG    │     5A      │ Red (+)      │ Critical │
│ (Safety)         │            │             │ Black (-)    │ sizing   │
├──────────────────┼────────────┼─────────────┼──────────────┼──────────┤
│ Fan Circuits     │  20-22 AWG │    0.5A     │ Red (+)      │ Standard │
│ (All 3 fans)     │            │             │ Black (-)    │          │
├──────────────────┼────────────┼─────────────┼──────────────┼──────────┤
│ Solenoid Valve   │  20 AWG    │    0.3A     │ Red (+)      │          │
│                  │            │             │ Black (-)    │          │
├──────────────────┼────────────┼─────────────┼──────────────┼──────────┤
│ Stepper Motor    │  20 AWG    │    1.5A     │ 4-wire       │ Coil     │
│                  │            │             │ color coded  │ pairs    │
├──────────────────┼────────────┼─────────────┼──────────────┼──────────┤
│ GPIO Signals     │  22-24 AWG │   40mA      │ Various      │ Signal   │
│ (ESP32)          │            │             │              │ only     │
├──────────────────┼────────────┼─────────────┼──────────────┼──────────┤
│ I2C Signals      │  24-26 AWG │    1mA      │ SDA/SCL      │ Twisted  │
│ (LCD)            │            │             │              │ pair     │
├──────────────────┼────────────┼─────────────┼──────────────┼──────────┤
│ Servo Signals    │  24-26 AWG │    1mA      │ Orange/      │ PWM      │
│ (PWM)            │            │             │ Yellow       │          │
├──────────────────┼────────────┼─────────────┼──────────────┼──────────┤
│ Common Ground    │  14 AWG    │    15A+     │ Black or     │ Bus bar  │
│ Bus              │            │             │ bare copper  │ or thick │
└──────────────────┴────────────┴─────────────┴──────────────┴──────────┘


AWG to Metric Conversion:
══════════════════════════
• 14 AWG ≈ 2.08mm² (1.63mm diameter)
• 16 AWG ≈ 1.31mm² (1.29mm diameter)
• 18 AWG ≈ 0.82mm² (1.02mm diameter)
• 20 AWG ≈ 0.52mm² (0.81mm diameter)
• 22 AWG ≈ 0.33mm² (0.64mm diameter)
• 24 AWG ≈ 0.21mm² (0.51mm diameter)
```

## Assembly Sequence Flowchart

```
═══════════════════════════════════════════════════════════════════════════
                       ASSEMBLY SEQUENCE
═══════════════════════════════════════════════════════════════════════════

START
  │
  ▼
[1] ⚠️  Install 25A fuses on BOTH power inputs FIRST
  │     (Solar + Grid 12V lines)
  ▼
[2] Set up Common Ground Bus (14 AWG thick wire/copper bar)
  │
  ▼
[3] Wire 5V Regulator (LM7805 or Buck Converter)
  │   • Input filter cap: 100µF across 12V input
  │   • Output filter cap: 10µF across 5V output
  ▼
[4] Connect ESP32 to 5V rail + Ground
  │   • Verify power LED lights up
  │   • Do NOT connect anything else yet
  ▼
[5] Install all Flyback Diodes (6 total):
  │   • 4× Relay coils (1N4007 each)
  │   • 1× Solenoid (1N4007)
  │   • 1× Power relay coil (1N4007)
  ▼
[6] Wire DHT11 Sensor
  │   • 10kΩ pull-up resistor to 3.3V (MANDATORY)
  │   • Test: Upload sensor read sketch
  ▼
[7] Wire I2C LCD Display
  │   • SDA to GPIO21, SCL to GPIO22
  │   • Run I2C scanner to verify address (0x27 or 0x3F)
  ▼
[8] Wire Relay Modules (1-4)
  │   • Relay #1: GPIO26 (Heater)
  │   • Relay #2: GPIO27 (Internal Fan)
  │   • Relay #3: GPIO14 (Solar Fans)
  │   • Relay #4: GPIO23 (Solenoid)
  │   • TEST each relay with simple blink sketch
  ▼
[9] Wire Servo Motors
  │   • Servo #1: GPIO12 (Solar Inlet)
  │   • Servo #2: GPIO13 (Top Vent)
  │   • Install 100µF decoupling cap on EACH servo
  │   • TEST: Sweep 0-180° sketch
  ▼
[10] Wire A4988 Stepper Driver
  │    • 100µF cap across VMOT
  │    • GPIO18 (STEP), GPIO19 (DIR), GPIO32 (ENABLE)
  │    • Adjust current limit with multimeter (Vref = 0.6V)
  ▼
[11] Connect NEMA17 Stepper
  │    • Verify coil pairs with multimeter (continuity test)
  │    • Red/Green = Coil A, Blue/Yellow = Coil B
  │    • TEST: Rotate shaft manually
  ▼
[12] ⚠️  Install 77°C Thermal Fuse on Heater Circuit
  │     (MANDATORY SAFETY - Do not skip!)
  ▼
[13] Connect High-Current Loads through Relays:
  │    • Heater element (18 AWG wire)
  │    • Internal fan (20-22 AWG)
  │    • Solar fans in parallel (20-22 AWG)
  │    • Solenoid valve (20 AWG)
  ▼
[14] Double-Check ALL Connections:
  │    • Verify polarities with multimeter
  │    • Check for shorts between power rails
  │    • Verify ground continuity (<0.1Ω)
  │    • Inspect all solder joints
  ▼
[15] Cable Management:
  │    • Separate high-current wires from signal wires
  │    • Use cable ties and heat shrink tubing
  │    • Label all connections
  ▼
[16] Upload Full Arduino Code:
  │    • Configure WiFi SSID/Password
  │    • Set MQTT broker address
  │    • Upload sketch
  ▼
[17] Power-Up Test Sequence:
  │    ┌─────────────────────────────────┐
  │    │ a) Power ESP32 ONLY (no loads)  │
  │    │ b) Verify serial output & WiFi  │
  │    │ c) Connect one load at a time   │
  │    │ d) Test each relay independently│
  │    │ e) Test servos (no-load)        │
  │    │ f) Test stepper (no eggs)       │
  │    └─────────────────────────────────┘
  ▼
[18] Final System Test:
  │    • Monitor temperature/humidity for 1 hour
  │    • Verify dashboard connection
  │    • Test all controls from web interface
  │    • Check thermal fuse functionality
  ▼
[19] ✅ ASSEMBLY COMPLETE
  │
  ▼
START INCUBATION CYCLE
```

---

## Safety Checklist (Pre-Power)

```
═══════════════════════════════════════════════════════════════════════════
                    ⚠️  SAFETY CHECKLIST
═══════════════════════════════════════════════════════════════════════════

BEFORE APPLYING POWER, VERIFY:

[ ] Both 25A fuses installed on solar and grid inputs
[ ] All 6 flyback diodes installed (correct polarity)
[ ] 77°C thermal fuse installed in series with heater
[ ] Ground bus properly connected to all components
[ ] No shorts between +12V rail and ground (use multimeter)
[ ] No shorts between +5V rail and ground
[ ] All polarities correct (red = +, black = -)
[ ] Heater wire gauge is 18 AWG minimum
[ ] Main power rails are 16 AWG minimum
[ ] DHT11 connected to 3.3V (NOT 5V)
[ ] 10kΩ pull-up resistor on DHT11 data line
[ ] All relay coils have flyback protection
[ ] Solenoid has flyback diode (inductive load)
[ ] Servo decoupling capacitors installed (100µF each)
[ ] A4988 driver has 100µF capacitor across VMOT
[ ] Stepper motor coils correctly identified and connected
[ ] Current limit adjusted on A4988 (Vref = 0.6V for 1.5A)
[ ] LCD I2C address verified (0x27 or 0x3F)
[ ] All wire connections secure (no loose strands)
[ ] All solder joints inspected (no cold joints)
[ ] Cable management complete (high-current separated from signals)
[ ] Arduino code uploaded and configured
[ ] Serial monitor working at 115200 baud
[ ] WiFi credentials configured in code
[ ] MQTT broker address configured
[ ] Fire extinguisher nearby (safety first!)
[ ] Adequate ventilation in enclosure

═══════════════════════════════════════════════════════════════════════════
             DO NOT POWER ON UNTIL ALL BOXES ARE CHECKED!
═══════════════════════════════════════════════════════════════════════════
```

---

## Troubleshooting Quick Reference

```
═══════════════════════════════════════════════════════════════════════════
                     TROUBLESHOOTING GUIDE
═══════════════════════════════════════════════════════════════════════════

SYMPTOM: ESP32 won't boot / no power LED
CAUSES:  • No 5V supply from regulator
         • Incorrect polarity on VIN/GND
         • Damaged ESP32 module
CHECK:   • Measure 5V at ESP32 VIN pin with multimeter
         • Verify regulator output (should be 5.0V ±0.2V)
         • Check for shorts on 5V rail

───────────────────────────────────────────────────────────────────────────

SYMPTOM: WiFi won't connect
CAUSES:  • Wrong SSID/password in code
         • Router out of range
         • ESP32 antenna issues
CHECK:   • Serial monitor shows connection attempts
         • Try connecting ESP32 closer to router
         • Verify WiFi credentials in code (case-sensitive)

───────────────────────────────────────────────────────────────────────────

SYMPTOM: DHT11 reads NaN or "--"
CAUSES:  • Missing 10kΩ pull-up resistor
         • Loose wiring
         • Damaged sensor
         • Wrong GPIO pin
CHECK:   • Verify 10kΩ resistor between DATA and 3.3V
         • Measure 3.3V at DHT11 VCC pin
         • Try different GPIO pin
         • Swap DHT11 sensor

───────────────────────────────────────────────────────────────────────────

SYMPTOM: LCD shows no text / garbled characters
CAUSES:  • Wrong I2C address
         • Loose I2C connections
         • Insufficient power
CHECK:   • Run I2C scanner (should find 0x27 or 0x3F)
         • Change address in code if different
         • Verify 5V at LCD VCC
         • Check SDA/SCL connections (GPIO21/22)

───────────────────────────────────────────────────────────────────────────

SYMPTOM: Relay doesn't click / load doesn't turn on
CAUSES:  • Relay coil not energized
         • Insufficient coil voltage
         • Missing flyback diode causes ESP32 reset
         • Damaged relay
CHECK:   • Measure 5V at relay coil when GPIO is HIGH
         • Verify flyback diode polarity
         • Test relay with direct 5V connection
         • Check load power supply (12V at COM terminal)

───────────────────────────────────────────────────────────────────────────

SYMPTOM: Heater doesn't heat up
CAUSES:  • Thermal fuse blown
         • Relay not switching
         • Heater element damaged
         • Loose 12V connection
CHECK:   • Measure voltage across heater when relay ON
         • Test thermal fuse continuity (should be <1Ω)
         • Verify 12V at relay COM terminal
         • Check heater element resistance (should be 2-4Ω for 12V/40-60W)

───────────────────────────────────────────────────────────────────────────

SYMPTOM: Servo jitters / doesn't move smoothly
CAUSES:  • Insufficient power (voltage sag)
         • Missing decoupling capacitor
         • EMI from motors/relays
         • Incorrect PWM frequency
CHECK:   • Install 100µF cap across servo power pins
         • Measure 5V at servo during movement (should stay >4.8V)
         • Separate servo power from motor power if possible
         • Verify PWM is 50Hz in code

───────────────────────────────────────────────────────────────────────────

SYMPTOM: Stepper motor doesn't move / skips steps
CAUSES:  • Current limit too low on A4988
         • Mechanical binding
         • Incorrect coil wiring
         • ENABLE pin not LOW
CHECK:   • Adjust A4988 Vref to 0.6V with multimeter
         • Verify ENABLE pin is LOW when rotating
         • Check coil pairs with continuity test
         • Manually rotate shaft (should have detent feel)
         • Slow down step rate in code

───────────────────────────────────────────────────────────────────────────

SYMPTOM: Solenoid doesn't open
CAUSES:  • Relay not switching
         • Missing flyback diode causes reset
         • Insufficient 12V power
         • Valve mechanically stuck
CHECK:   • Measure 12V across solenoid when relay ON
         • Verify flyback diode polarity (cathode to +)
         • Test solenoid with direct 12V (should hear click)
         • Check water pressure (solenoid needs ~10 PSI minimum)

───────────────────────────────────────────────────────────────────────────

SYMPTOM: ESP32 keeps resetting / brownouts
CAUSES:  • Power supply insufficient
         • Voltage sag when loads switch
         • Missing filter capacitors
         • Ground loop issues
CHECK:   • Monitor 5V rail with oscilloscope during relay switching
         • Verify both 1000µF caps installed on 12V rail
         • Check all grounds connect to single point
         • Use separate 5V supply for ESP32 if needed

═══════════════════════════════════════════════════════════════════════════
```

---

**END OF ASCII WIRING DIAGRAMS**

**For interactive diagrams, see:**
- Mermaid.js format: [WIRING-DIAGRAM-MERMAID.md](./WIRING-DIAGRAM-MERMAID.md)
- Eraser.io format: [WIRING-DIAGRAM-ERASER.md](./WIRING-DIAGRAM-ERASER.md)
