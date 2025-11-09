The system combines solar thermal heating, grid backup, and microcontroller-based precision 
control to maintain optimal temperature (37.5°C) and humidity (50–80% RH) for chicken egg 
incubation over a 21-day cycle. 
 
The vision is to deliver a low-cost, sustainable, and intelligent incubator that: - Reduces dependency on unreliable grid power - Minimizes manual intervention - Maximizes hatch rate (>85%) - Operates autonomously with real-time monitoring via LCD - Adapts dynamically to environmental conditions using PID control and servo-actuated 
ventilation 
 
2. SYSTEM CAPACITY & APPLICATION 
 
Egg Capacity:          30 chicken eggs 
Egg Type:              Standard poultry (Gallus gallus domesticus) 
Incubation Period:     21 days (automatic turning until Day 18) 
Water Source:          Tap water (manual refill bucket) 
 
4. CONTROL SYSTEM ARCHITECTURE 
 
4.1 Core Controller - Microcontroller: ESP32 (Dual-core, Wi-Fi/BLE) - Power Supply:    Dedicated 12V → 5V regulated - Programming:     Arduino IDE / ESP-IDF (PID + RTC) 
 
4.2 Sensors 
DHT11          → Temperature & Humidity (Digital 1-Wire) 
I2C LCD 16x2   → Real-time display (I2C SDA/SCL) 
 
4.3 Actuators 
Soldering Iron Element → Primary heating (12V Relay + PID) 
1× DC Fan (Internal)   →   Circulation (JQC3F-05VDC-C Relay) 
2× DC Fans (Solar)     →   Push hot air (JQC3F-05VDC-C Relay) 
SG90 Servo (x2)        →    1. Solar inlet flap @ 37°C 
                                 2. Top vent @ low/high RH 
NEMA17 + A4988     →     Egg tray rotation (Step/Dir) 
Solenoid Valve (12V)   →  Water release (JQC3F-05VDC-C Relay) 
 
 
 
 
 
 
5. POWER MANAGEMENT SYSTEM 
Source            
| Voltage  | Role             -------------------|------------|------------------|----------- 
| Switching 
Solar Inverter  |  12V DC| Primary (day)   | 12V 30A SL-C Relay 
Grid Adapter   | 12V DC | Backup (night)  | Auto via ESP32 
ESP32 Supply|   5V DC | Always ON       | Independent regulator 
Protection: - 25A inline fuse - 2× 1000µF 16V capacitors (ripple) - Flyback diodes across relays 
Power Strategy: ESP32 monitors solar voltage; switch to grid if <11.8V 
6. ENVIRONMENTAL CONTROL LOGIC 
6.1 Temperature Control (PID) 
Setpoint: 37.5°C ± 0.3°C 
IF T < 37.2°C → Heat + internal fan ON 
IF T ≥ 37.5°C → Heat OFF 
IF T ≥ 37.8°C → Open solar inlet flap (servo) 
6.2 Humidity Control 
Target: 55% (Days 1–18), 70% (Days 19–21) 
IF RH < 50% → Solenoid pulse (2–3 sec) 
IF RH > 80% → Open top vent (servo) 
6.3 Egg Turning Schedule 
Frequency: Every 4 hours (6 turns/day) 
Angle:     45° left → 10 sec → 45° right 
Disabled:  After Day 18 (lockdown) - Overheat cutoff (software + thermal fuse) - Power failure recovery (EEPROM settings) - Brownout protection (voltage loop) - Fuse & diode on all high-current paths - Full insulation & condensation sealing 
8. BILL OF MATERIALS (BOM) – KEY COMPONENTS 
 
Item                            | Model/Spec                            | Qty 
_____________________________________________- 
ESP32 Dev Board      |     NodeMCU / DevKit            | 1 
DHT11 Sensor            |    Temp & RH                         | 1 
I2C LCD 16x2             |    Blue backlight                     | 1 
Relay Module             |     JQC3F-05VDC-C (5V coil) | 1 
Power Relay               |    12V 30A SL-C                     | 1 
Heating Element         |    Soldering iron (~40–60W)   | 1 
DC Fans (60mm)        |    12V, 0.2A                             | 3 
Servo Motor                |    SG90                                   | 2 
Stepper Motor             |    NEMA17 (1.8°/step)            | 1 
Driver                          |    A4988                                  | 1 
Solenoid Valve            |   12V DC, 1/4"                        | 1 
Capacitors                   |   1000µF 16V                         | 2 
Fuse                            |    25A blade                            | 2 
Diode                           |   1N4007 or equiv.                 | 5 
 
 
 
 
 
 




import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, AlertTriangle } from 'lucide-react';

const WiringDiagram = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'power',
      title: '1. POWER DISTRIBUTION NETWORK',
      color: 'bg-red-50 border-red-300',
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-800">SAFETY FIRST</p>
                <p className="text-sm text-yellow-700">Install 25A inline fuse on main 12V rail before any connections. Use 16 AWG wire minimum for 12V power rails.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">A. Primary Power Rail (12V)</h4>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-blue-600">Solar Inverter (12V DC) → Main Power Input:</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="text-red-600 font-semibold">Solar (+12V)</span> → <span className="font-mono bg-gray-100 px-1">25A FUSE</span> → 12V 30A SL-C Relay (Coil Terminal 85)</li>
                <li><span className="text-blue-600 font-semibold">Solar GND</span> → Common Ground Bus Bar</li>
                <li>12V 30A SL-C Relay (Coil Terminal 86) → ESP32 GPIO25 (Solar Control Signal)</li>
                <li>ESP32 GPIO25 → 1kΩ resistor → 2N2222 transistor base</li>
                <li>2N2222 emitter → GND | collector → Relay coil (85)</li>
              </ol>
              
              <p className="font-semibold text-blue-600 mt-3">Grid Adapter (12V DC) → Backup Power:</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="text-red-600 font-semibold">Grid (+12V)</span> → <span className="font-mono bg-gray-100 px-1">25A FUSE</span> → 12V 30A SL-C Relay (Common Terminal 30)</li>
                <li><span className="text-blue-600 font-semibold">Grid GND</span> → Common Ground Bus Bar</li>
              </ol>

              <p className="font-semibold text-green-600 mt-3">Relay Output (Switched 12V):</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li>12V 30A Relay (NO Terminal 87) → <span className="font-mono bg-gray-100 px-1">1000μF 16V Capacitor (+)</span> → Main 12V Rail (+)</li>
                <li>1000μF Capacitor (-) → Common Ground</li>
                <li>Main 12V Rail (+) → <span className="font-mono bg-gray-100 px-1">Second 1000μF Capacitor (+)</span> (parallel)</li>
                <li>Second capacitor (-) → Common Ground</li>
              </ol>
            </div>
          </div>

          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">B. ESP32 Power Supply (5V Isolated)</h4>
            <div className="space-y-2 text-sm">
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="text-red-600 font-semibold">Solar/Grid 12V</span> → LM7805 or Buck Converter INPUT (+)</li>
                <li>Regulator OUTPUT (+5V) → ESP32 VIN (or 5V pin)</li>
                <li>Regulator GND → ESP32 GND → Common Ground Bus</li>
                <li>Add 100μF capacitor across regulator input (12V to GND)</li>
                <li>Add 10μF capacitor across regulator output (5V to GND)</li>
              </ol>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'heating',
      title: '2. HEATING SYSTEM WIRING',
      color: 'bg-orange-50 border-orange-300',
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">Soldering Iron Element (40-60W) via Relay</h4>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-purple-600">Relay Module Connections (JQC3F-05VDC-C #1 - HEATING):</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="font-semibold">Relay Coil (+)</span> → 5V from ESP32 (or separate 5V rail)</li>
                <li><span className="font-semibold">Relay Coil (-)</span> → ESP32 GPIO26 (PWM for PID control)</li>
                <li>Add 1N4007 diode across relay coil: <span className="text-gray-600">Cathode to (+), Anode to (-)</span></li>
              </ol>

              <p className="font-semibold text-red-600 mt-3">High Current Path (Heating Element):</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="text-red-600 font-semibold">Main 12V Rail (+)</span> → Relay COM (Common Terminal)</li>
                <li><span className="font-semibold">Relay NO (Normally Open)</span> → <span className="text-red-600 font-semibold">Soldering Iron (+) Lead</span></li>
                <li><span className="text-blue-600 font-semibold">Soldering Iron (-) Lead</span> → Common Ground</li>
                <li>Install thermal fuse (77°C) in series with heating element for safety</li>
              </ol>

              <div className="bg-red-50 border border-red-200 p-2 mt-2 rounded">
                <p className="text-xs text-red-700"><strong>Note:</strong> Ensure soldering iron power rating ≤60W @ 12V (≤5A). Use 18 AWG wire minimum.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'fans',
      title: '3. FAN SYSTEM WIRING (3 Fans Total)',
      color: 'bg-blue-50 border-blue-300',
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">A. Internal Circulation Fan (Single 12V Fan)</h4>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-purple-600">Relay Module #2 (JQC3F-05VDC-C - INTERNAL FAN):</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="font-semibold">Relay Coil (+)</span> → 5V from ESP32</li>
                <li><span className="font-semibold">Relay Coil (-)</span> → ESP32 GPIO27 (Digital ON/OFF)</li>
                <li>Add 1N4007 diode across relay coil (flyback protection)</li>
              </ol>

              <p className="font-semibold text-red-600 mt-3">Fan Power Connections:</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="text-red-600 font-semibold">Main 12V Rail (+)</span> → Relay COM</li>
                <li><span className="font-semibold">Relay NO (Normally Open)</span> → <span className="text-red-600 font-semibold">Internal Fan RED wire (+)</span></li>
                <li><span className="text-blue-600 font-semibold">Internal Fan BLACK wire (-)</span> → Common Ground</li>
              </ol>
            </div>
          </div>

          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">B. Solar Fans (2× 12V Fans) - PARALLEL Configuration</h4>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-purple-600">Relay Module #3 (JQC3F-05VDC-C - SOLAR FANS):</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="font-semibold">Relay Coil (+)</span> → 5V from ESP32</li>
                <li><span className="font-semibold">Relay Coil (-)</span> → ESP32 GPIO14 (Digital ON/OFF)</li>
                <li>Add 1N4007 diode across relay coil</li>
              </ol>

              <p className="font-semibold text-red-600 mt-3">Parallel Fan Wiring (Both fans operate together):</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="text-red-600 font-semibold">Main 12V Rail (+)</span> → Relay COM</li>
                <li><span className="font-semibold">Relay NO</span> → Junction point (wire nut or terminal block)</li>
                <li>From junction: 
                  <ul className="ml-4 mt-1">
                    <li>→ <span className="text-red-600 font-semibold">Solar Fan #1 RED (+)</span></li>
                    <li>→ <span className="text-red-600 font-semibold">Solar Fan #2 RED (+)</span></li>
                  </ul>
                </li>
                <li><span className="text-blue-600 font-semibold">Solar Fan #1 BLACK (-)</span> → Common Ground junction</li>
                <li><span className="text-blue-600 font-semibold">Solar Fan #2 BLACK (-)</span> → Common Ground junction</li>
                <li>Common Ground junction → Common Ground Bus</li>
              </ol>

              <div className="bg-blue-50 border border-blue-200 p-2 mt-2 rounded">
                <p className="text-xs text-blue-700"><strong>Parallel vs Series:</strong> Parallel configuration chosen because: (1) Each fan receives full 12V for optimal speed, (2) If one fan fails, other continues, (3) Combined current = 0.4A, well within relay rating.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'servos',
      title: '4. SERVO MOTOR WIRING (2× SG90)',
      color: 'bg-green-50 border-green-300',
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">Servo #1: Solar Inlet Flap Control</h4>
            <div className="space-y-2 text-sm">
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="text-red-600 font-semibold">Servo RED wire (+5V)</span> → 5V Rail from ESP32 regulator</li>
                <li><span className="text-orange-600 font-semibold">Servo ORANGE/YELLOW wire (Signal)</span> → ESP32 GPIO12 (PWM)</li>
                <li><span className="text-blue-600 font-semibold">Servo BROWN/BLACK wire (GND)</span> → Common Ground</li>
                <li>Add 100μF capacitor across servo power (5V to GND) for stability</li>
              </ol>
            </div>
          </div>

          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">Servo #2: Top Vent Control</h4>
            <div className="space-y-2 text-sm">
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="text-red-600 font-semibold">Servo RED wire (+5V)</span> → 5V Rail from ESP32 regulator</li>
                <li><span className="text-orange-600 font-semibold">Servo ORANGE/YELLOW wire (Signal)</span> → ESP32 GPIO13 (PWM)</li>
                <li><span className="text-blue-600 font-semibold">Servo BROWN/BLACK wire (GND)</span> → Common Ground</li>
                <li>Add 100μF capacitor across servo power (5V to GND)</li>
              </ol>

              <div className="bg-green-50 border border-green-200 p-2 mt-2 rounded">
                <p className="text-xs text-green-700"><strong>Power Note:</strong> Both servos draw ~100-200mA each during movement. Ensure 5V regulator can supply ≥1A total (ESP32 + 2 servos).</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'stepper',
      title: '5. STEPPER MOTOR SYSTEM (NEMA17 + A4988)',
      color: 'bg-purple-50 border-purple-300',
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">A4988 Driver Module Connections</h4>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-purple-600">Power Connections:</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="text-red-600 font-semibold">Main 12V Rail (+)</span> → A4988 VMOT pin</li>
                <li><span className="text-blue-600 font-semibold">Common Ground</span> → A4988 GND (VMOT ground)</li>
                <li><span className="text-red-600 font-semibold">5V from ESP32</span> → A4988 VDD pin (logic power)</li>
                <li><span className="text-blue-600 font-semibold">Common Ground</span> → A4988 GND (VDD ground)</li>
                <li>Add 100μF capacitor across VMOT and GND (near driver)</li>
              </ol>

              <p className="font-semibold text-green-600 mt-3">Control Signals from ESP32:</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li>ESP32 GPIO18 → A4988 STEP pin</li>
                <li>ESP32 GPIO19 → A4988 DIR pin (Direction)</li>
                <li>ESP32 GPIO21 → A4988 ENABLE pin (Active LOW - pull LOW to enable)</li>
                <li>A4988 RESET pin → A4988 SLEEP pin (tie together for normal operation)</li>
              </ol>

              <p className="font-semibold text-orange-600 mt-3">Microstepping Configuration (Optional):</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li>A4988 MS1 → GND (full step) OR 5V per desired resolution</li>
                <li>A4988 MS2 → GND</li>
                <li>A4988 MS3 → GND</li>
                <li><span className="text-xs italic">Leave disconnected for full-step (1.8° per step)</span></li>
              </ol>
            </div>
          </div>

          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">NEMA17 Motor Connections</h4>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">4-Wire Stepper to A4988:</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="text-red-600 font-semibold">Coil A+</span> (typically RED wire) → A4988 1B</li>
                <li><span className="text-green-600 font-semibold">Coil A-</span> (typically GREEN) → A4988 1A</li>
                <li><span className="text-blue-600 font-semibold">Coil B+</span> (typically BLUE) → A4988 2B</li>
                <li><span className="text-yellow-600 font-semibold">Coil B-</span> (typically YELLOW) → A4988 2A</li>
              </ol>

              <div className="bg-yellow-50 border border-yellow-200 p-2 mt-2 rounded">
                <p className="text-xs text-yellow-700"><strong>Current Limiting:</strong> Adjust A4988 potentiometer to set current limit. For typical NEMA17 (1.5A): Vref = 0.6V. Measure voltage between potentiometer wiper and GND, adjust to 0.6V using ceramic screwdriver.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'solenoid',
      title: '6. SOLENOID VALVE WIRING',
      color: 'bg-cyan-50 border-cyan-300',
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">12V DC Solenoid Valve via Relay</h4>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-purple-600">Relay Module #4 (JQC3F-05VDC-C - SOLENOID):</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="font-semibold">Relay Coil (+)</span> → 5V from ESP32</li>
                <li><span className="font-semibold">Relay Coil (-)</span> → ESP32 GPIO22 (Pulse control 2-3 sec)</li>
                <li>Add 1N4007 diode across relay coil</li>
              </ol>

              <p className="font-semibold text-red-600 mt-3">Solenoid Power Path:</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="text-red-600 font-semibold">Main 12V Rail (+)</span> → Relay COM</li>
                <li><span className="font-semibold">Relay NO</span> → <span className="text-red-600 font-semibold">Solenoid RED wire (+)</span></li>
                <li><span className="text-blue-600 font-semibold">Solenoid BLACK wire (-)</span> → Common Ground</li>
                <li>Add 1N4007 diode across solenoid coil: <span className="text-gray-600">Cathode to (+), Anode to (-)</span></li>
              </ol>

              <div className="bg-cyan-50 border border-cyan-200 p-2 mt-2 rounded">
                <p className="text-xs text-cyan-700"><strong>Operation:</strong> ESP32 pulses GPIO22 HIGH for 2-3 seconds to release water when humidity drops below 50%.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sensors',
      title: '7. SENSOR CONNECTIONS',
      color: 'bg-indigo-50 border-indigo-300',
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">DHT11 Temperature & Humidity Sensor</h4>
            <div className="space-y-2 text-sm">
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="text-red-600 font-semibold">DHT11 VCC (+)</span> → ESP32 3.3V pin</li>
                <li><span className="text-green-600 font-semibold">DHT11 DATA</span> → ESP32 GPIO4</li>
                <li><span className="text-blue-600 font-semibold">DHT11 GND (-)</span> → Common Ground</li>
                <li>Add 10kΩ pull-up resistor: DATA pin to VCC (3.3V)</li>
                <li>If using 4-pin DHT11, leave NC pin unconnected</li>
              </ol>
            </div>
          </div>

          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">I2C LCD 16x2 Display</h4>
            <div className="space-y-2 text-sm">
              <ol className="list-decimal ml-6 space-y-1">
                <li><span className="text-red-600 font-semibold">LCD VCC (+)</span> → ESP32 5V pin</li>
                <li><span className="text-blue-600 font-semibold">LCD GND (-)</span> → Common Ground</li>
                <li><span className="text-green-600 font-semibold">LCD SDA</span> → ESP32 GPIO21 (I2C Data)</li>
                <li><span className="text-yellow-600 font-semibold">LCD SCL</span> → ESP32 GPIO22 (I2C Clock)</li>
              </ol>

              <div className="bg-indigo-50 border border-indigo-200 p-2 mt-2 rounded">
                <p className="text-xs text-indigo-700"><strong>I2C Address:</strong> Typically 0x27 or 0x3F. Scan with I2C scanner code if display doesn't work.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'grounding',
      title: '8. GROUNDING & PROTECTION',
      color: 'bg-gray-50 border-gray-400',
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">Common Ground Bus Configuration</h4>
            <div className="space-y-2 text-sm">
              <p className="mb-2">All ground connections must terminate at a common ground bus bar or thick wire (14 AWG minimum). Connect in this order:</p>
              <ol className="list-decimal ml-6 space-y-1">
                <li>Solar inverter GND → Bus bar</li>
                <li>Grid adapter GND → Bus bar</li>
                <li>ESP32 GND → Bus bar</li>
                <li>All relay GND returns → Bus bar</li>
                <li>All sensor GND → Bus bar</li>
                <li>Motor driver GND → Bus bar</li>
                <li>Capacitor negative terminals → Bus bar</li>
              </ol>
            </div>
          </div>

          <div className="bg-white p-4 border rounded">
            <h4 className="font-bold mb-3">Protection Components Summary</h4>
            <div className="space-y-2 text-sm">
              <ul className="list-disc ml-6 space-y-1">
                <li><span className="font-semibold">Fuses:</span> 25A inline on both solar and grid 12V inputs</li>
                <li><span className="font-semibold">Flyback Diodes:</span> 1N4007 across all relay coils (5×) and solenoid</li>
                <li><span className="font-semibold">Filter Capacitors:</span> 2× 1000μF on main 12V rail, 100μF on each servo, 100μF on motor driver</li>
                <li><span className="font-semibold">Thermal Fuse:</span> 77°C in series with heating element</li>
                <li><span className="font-semibold">Pull-up Resistor:</span> 10kΩ on DHT11 data line</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pinout',
      title: '9. ESP32 GPIO PIN ASSIGNMENT TABLE',
      color: 'bg-pink-50 border-pink-300',
      content: (
        <div className="bg-white p-4 border rounded">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-left">GPIO Pin</th>
                  <th className="border px-3 py-2 text-left">Function</th>
                  <th className="border px-3 py-2 text-left">Component</th>
                  <th className="border px-3 py-2 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border px-3 py-1 font-mono">GPIO4</td><td className="border px-3 py-1">DHT11 Data</td><td className="border px-3 py-1">Temp/Humidity Sensor</td><td className="border px-3 py-1">Input</td></tr>
                <tr className="bg-gray-50"><td className="border px-3 py-1 font-mono">GPIO12</td><td className="border px-3 py-1">Servo 1 PWM</td><td className="border px-3 py-1">Solar Inlet Flap</td><td className="border px-3 py-1">Output (PWM)</td></tr>
                <tr><td className="border px-3 py-1 font-mono">GPIO13</td><td className="border px-3 py-1">Servo 2 PWM</td><td className="border px-3 py-1">Top Vent Control</td><td className="border px-3 py-1">Output (PWM)</td></tr>
                <tr className="bg-gray-50"><td className="border px-3 py-1 font-mono">GPIO14</td><td className="border px-3 py-1">Relay Control</td><td className="border px-3 py-1">Solar Fans (2×)</td><td className="border px-3 py-1">Output</td></tr>
                <tr><td className="border px-3 py-1 font-mono">GPIO18</td><td className="border px-3 py-1">Stepper STEP</td><td className="border px-3 py-1">A4988 Driver</td><td className="border px-3 py-1">Output</td></tr>
                <tr className="bg-gray-50"><td className="border px-3 py-1 font-mono">GPIO19</td><td className="border px-3 py-1">Stepper DIR</td><td className="border px-3 py-1">A4988 Driver</td><td className="border px-3 py-1">Output</td></tr>
                <tr><td className="border px-3 py-1 font-mono">GPIO21</td><td className="border px-3 py-1">I2C SDA</td><td className="border px-3 py-1">LCD Display</td><td className="border px-3 py-1">I2C Data</td></tr>
                <tr className="bg-gray-50"><td className="border px-3 py-1 font-mono">GPIO22</td><td className="border px-3 py-1">I2C SCL</td><td className="border px-3 py-1">LCD Display</td><td className="border px-3 py-1">I2C Clock</td></tr>
                <tr><td className="border px-3 py-1 font-mono">GPIO23</td><td className="border px-3 py-1">Relay Control</td><td className="border px-3 py-1">Solenoid Valve</td><td className="border px-3 py-1">Output</td></tr>
                <tr className="bg-gray-50"><td className="border px-3 py-1 font-mono">GPIO25</td><td className="border px-3 py-1">Power Switch</td><td className="border px-3 py-1">Solar/Grid Relay</td><td className="border px-3 py-1">Output</td></tr>
                <tr><td className="border px-3 py-1 font-mono">GPIO26</td><td className="border px-3 py-1">Relay Control</td><td className="border px-3 py-1">Heating Element</td><td className="border px-3 py-1">Output (PWM)</td></tr>
                <tr className="bg-gray-50"><td className="border px-3 py-1 font-mono">GPIO27</td><td className="border px-3 py-1">Relay Control</td><td className="border px-3 py-1">Internal Fan</td><td className="border px-3 py-1">Output</td></tr>
                <tr><td className="border px-3 py-1 font-mono">GPIO32</td><td className="border px-3 py-1">Stepper ENABLE</td><td className="border px-3 py-1">A4988 Driver</td><td className="border px-3 py-1">Output</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'wire-gauge',
      title: '10. WIRE GAUGE RECOMMENDATIONS',
      color: 'bg-yellow-50 border-yellow-300',
      content: (
        <div className="bg-white p-4 border rounded">
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-red-600">High Current Paths (12V Main Rails):</p>
              <ul className="list-disc ml-6 mt-1">
                <li>Solar/Grid input to relay: <span className="font-mono bg-gray-100 px-1">16 AWG</span> (handles up to 10A)</li>
                <li>Main 12V distribution: <span className="font-mono bg-gray-100 px-1">16 AWG</span></li>
                <li>Heating element wiring: <span className="font-mono bg-gray-100 px-1">18 AWG</span> minimum</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-blue-600">Medium Current (Fans, Motor, Solenoid):</p>
              <ul className="list-disc ml-6 mt-1">
                <li>Fan power wires: <span className="font-mono bg-gray-100 px-1">20-22 AWG</span></li>
                <li>Stepper motor power: <span className="font-mono bg-gray-100 px-1">20 AWG</span></li>
                <li>Solenoid valve: <span className="font-mono bg-gray-100 px-1">20 AWG</span></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-green-600">Low Current (Control Signals, Sensors):</p>
              <ul className="list-disc ml-6 mt-1">
                <li>ESP32 GPIO signals: <span className="font-mono bg-gray-100 px-1">22-24 AWG</span></li>
                <li>Sensor connections: <span className="font-mono bg-gray-100 px-1">22-24 AWG</span></li>
                <li>I2C, servo signals: <span className="font-mono bg-gray-100 px-1">24-26 AWG</span></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-purple-600">Ground Return Paths:</p>
              <ul className="list-disc ml-6 mt-1">
                <li>Main ground bus: <span className="font-mono bg-gray-100 px-1">14 AWG</span> thick wire or copper bus bar</li>
                <li>Component grounds: Match the power wire gauge</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'assembly',
      title: '11. ASSEMBLY SEQUENCE',
      color: 'bg-teal-50 border-teal-300',
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 border-l-4 border-amber-400 p-3">
            <p className="text-sm font-semibold text-amber-800">⚠️ DISCONNECT ALL POWER SOURCES BEFORE WIRING</p>
          </div>
          
          <div className="bg-white p-4 border rounded">
            <ol className="list-decimal ml-6 space-y-2 text-sm">
              <li><span className="font-semibold">Install fuses</span> on both 12V inputs (solar and grid) FIRST</li>
              <li><span className="font-semibold">Set up common ground bus bar</span> - use thick 14 AWG wire or copper bar</li>
              <li><span className="font-semibold">Wire 5V regulator</span> (LM7805/Buck converter) for ESP32 - keep isolated from switching noise</li>
              <li><span className="font-semibold">Connect ESP32</span> to 5V supply and ground - verify power LED before proceeding</li>
              <li><span className="font-semibold">Install filter capacitors</span> (2× 1000μF on 12V rail, 100μF on servos/driver)</li>
              <li><span className="font-semibold">Wire sensors</span> (DHT11, LCD) - test basic communication</li>
              <li><span className="font-semibold">Connect relay modules</span> - install flyback diodes on ALL relay coils</li>
              <li><span className="font-semibold">Wire high-current loads</span> through relays (heating, fans, solenoid)</li>
              <li><span className="font-semibold">Connect servos</span> with decoupling capacitors</li>
              <li><span className="font-semibold">Wire stepper system</span> (A4988 + NEMA17) - adjust current limit</li>
              <li><span className="font-semibold">Install thermal fuse</span> on heating element</li>
              <li><span className="font-semibold">Double-check all polarities</span> - especially power connections</li>
              <li><span className="font-semibold">Cable management</span> - separate high-current from signal wires</li>
              <li><span className="font-semibold">Upload test code</span> to ESP32 before connecting loads</li>
              <li><span className="font-semibold">Power up gradually</span> - test each subsystem individually</li>
            </ol>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-800">Solar Egg Incubator</h1>
        </div>
        <h2 className="text-xl text-gray-600 mb-4">Detailed Wiring Design Specification</h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">System Overview:</span> ESP32-controlled incubator with solar/grid hybrid power, 
            30-egg capacity, PID temperature control, automated humidity management, and servo-actuated ventilation.
          </p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-800">CRITICAL SAFETY WARNINGS</p>
              <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc ml-4">
                <li>Always install 25A fuses on BOTH power inputs before any connections</li>
                <li>NEVER work on the system while powered - disconnect all sources</li>
                <li>Install thermal fuse (77°C) on heating element - this is mandatory</li>
                <li>Use proper wire gauges - undersized wire can cause fires</li>
                <li>Double-check ALL polarities before applying power</li>
                <li>Keep high-voltage wiring away from signal/sensor wires</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className={`border-2 rounded-lg overflow-hidden ${section.color}`}>
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-80 transition-colors"
            >
              <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
              {expandedSection === section.id ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </button>
            
            {expandedSection === section.id && (
              <div className="px-6 pb-6">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-bold text-green-800 mb-3">✓ Pre-Power Checklist</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p>□ All fuses installed (25A × 2)</p>
            <p>□ All flyback diodes installed (6× 1N4007)</p>
            <p>□ Filter capacitors in place</p>
            <p>□ Thermal fuse on heater</p>
            <p>□ Ground bus connected</p>
          </div>
          <div className="space-y-1">
            <p>□ All polarities verified</p>
            <p>□ No shorts between power rails</p>
            <p>□ Wire gauges appropriate</p>
            <p>□ Test code uploaded to ESP32</p>
            <p>□ Multimeter readings correct</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WiringDiagram;