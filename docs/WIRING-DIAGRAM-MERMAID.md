# Wiring Diagram - Mermaid.js Format

This document contains detailed wiring diagrams in Mermaid.js format for the ESP32 Solar Egg Incubator system.

## Complete System Wiring Diagram

```mermaid
graph TB
    subgraph "Power Distribution"
        SolarInv[Solar Inverter<br/>12V DC]
        GridAdapt[Grid Adapter<br/>12V DC]
        Fuse1[25A Fuse]
        Fuse2[25A Fuse]
        PowerSwitch[12V 30A SL-C<br/>Power Relay]
        Cap1[1000µF<br/>Capacitor]
        Cap2[1000µF<br/>Capacitor]
        MainRail[Main 12V Rail]
        Regulator[LM7805 or<br/>Buck Converter<br/>12V→5V]
        Rail5V[5V Rail]
        GndBus[Common Ground Bus<br/>14 AWG]

        SolarInv -->|+12V| Fuse1
        GridAdapt -->|+12V| Fuse2
        Fuse1 --> PowerSwitch
        Fuse2 --> PowerSwitch
        PowerSwitch --> Cap1
        Cap1 --> Cap2
        Cap2 --> MainRail
        MainRail --> Regulator
        Regulator --> Rail5V
        SolarInv -->|GND| GndBus
        GridAdapt -->|GND| GndBus
    end

    subgraph "ESP32 Microcontroller"
        ESP32[ESP32 DevKit]
        Rail5V -->|5V| ESP32
        GndBus -->|GND| ESP32

        GPIO4[GPIO4<br/>DHT11 Data]
        GPIO12[GPIO12<br/>Servo1 PWM]
        GPIO13[GPIO13<br/>Servo2 PWM]
        GPIO14[GPIO14<br/>Solar Fans Relay]
        GPIO18[GPIO18<br/>Stepper STEP]
        GPIO19[GPIO19<br/>Stepper DIR]
        GPIO21[GPIO21<br/>I2C SDA]
        GPIO22[GPIO22<br/>I2C SCL]
        GPIO23[GPIO23<br/>Solenoid Relay]
        GPIO26[GPIO26<br/>Heater Relay]
        GPIO27[GPIO27<br/>Int Fan Relay]
        GPIO32[GPIO32<br/>Stepper ENABLE]

        ESP32 --- GPIO4
        ESP32 --- GPIO12
        ESP32 --- GPIO13
        ESP32 --- GPIO14
        ESP32 --- GPIO18
        ESP32 --- GPIO19
        ESP32 --- GPIO21
        ESP32 --- GPIO22
        ESP32 --- GPIO23
        ESP32 --- GPIO26
        ESP32 --- GPIO27
        ESP32 --- GPIO32
    end

    subgraph "Sensors"
        DHT11[DHT11<br/>Temp/Humidity]
        PullUp[10kΩ<br/>Pull-up]
        LCD[I2C LCD 16x2<br/>Address: 0x27]

        ESP32 -->|3.3V| DHT11
        GPIO4 --> DHT11
        DHT11 -->|Data| PullUp
        PullUp -->|3.3V| ESP32
        DHT11 -->|GND| GndBus

        Rail5V -->|5V| LCD
        GPIO21 -->|SDA| LCD
        GPIO22 -->|SCL| LCD
        LCD -->|GND| GndBus
    end

    subgraph "Relay Module #1 - Heater"
        Relay1[JQC3F Relay<br/>5V Coil]
        Diode1[1N4007<br/>Flyback Diode]
        HeaterElem[Soldering Iron<br/>40-60W @ 12V]
        ThermalFuse[77°C<br/>Thermal Fuse]

        Rail5V -->|Coil +| Relay1
        GPIO26 -->|Coil -| Relay1
        Diode1 -.->|Protection| Relay1
        MainRail -->|COM| Relay1
        Relay1 -->|NO| ThermalFuse
        ThermalFuse --> HeaterElem
        HeaterElem -->|GND| GndBus
    end

    subgraph "Relay Module #2 - Internal Fan"
        Relay2[JQC3F Relay<br/>5V Coil]
        Diode2[1N4007<br/>Flyback Diode]
        IntFan[12V DC Fan<br/>60mm 0.2A]

        Rail5V -->|Coil +| Relay2
        GPIO27 -->|Coil -| Relay2
        Diode2 -.->|Protection| Relay2
        MainRail -->|COM| Relay2
        Relay2 -->|NO| IntFan
        IntFan -->|GND| GndBus
    end

    subgraph "Relay Module #3 - Solar Fans"
        Relay3[JQC3F Relay<br/>5V Coil]
        Diode3[1N4007<br/>Flyback Diode]
        SolarFan1[12V DC Fan<br/>60mm 0.2A]
        SolarFan2[12V DC Fan<br/>60mm 0.2A]
        Junction[Junction<br/>Parallel]

        Rail5V -->|Coil +| Relay3
        GPIO14 -->|Coil -| Relay3
        Diode3 -.->|Protection| Relay3
        MainRail -->|COM| Relay3
        Relay3 -->|NO| Junction
        Junction --> SolarFan1
        Junction --> SolarFan2
        SolarFan1 -->|GND| GndBus
        SolarFan2 -->|GND| GndBus
    end

    subgraph "Relay Module #4 - Solenoid"
        Relay4[JQC3F Relay<br/>5V Coil]
        Diode4[1N4007<br/>Flyback Diode]
        Solenoid[12V Solenoid<br/>Valve 1/4"]
        Diode5[1N4007<br/>Solenoid Diode]

        Rail5V -->|Coil +| Relay4
        GPIO23 -->|Coil -| Relay4
        Diode4 -.->|Protection| Relay4
        MainRail -->|COM| Relay4
        Relay4 -->|NO| Solenoid
        Diode5 -.->|Protection| Solenoid
        Solenoid -->|GND| GndBus
    end

    subgraph "Servo Motors"
        Servo1[SG90<br/>Solar Inlet Flap]
        Servo2[SG90<br/>Top Vent]
        ServoCap1[100µF<br/>Decoupling]
        ServoCap2[100µF<br/>Decoupling]

        Rail5V -->|Power| ServoCap1
        ServoCap1 --> Servo1
        GPIO12 -->|Signal| Servo1
        Servo1 -->|GND| GndBus

        Rail5V -->|Power| ServoCap2
        ServoCap2 --> Servo2
        GPIO13 -->|Signal| Servo2
        Servo2 -->|GND| GndBus
    end

    subgraph "Stepper Motor System"
        A4988[A4988<br/>Driver Module]
        DriverCap[100µF<br/>Decoupling]
        NEMA17[NEMA17<br/>Stepper Motor<br/>1.8°/step]

        MainRail -->|VMOT| DriverCap
        DriverCap --> A4988
        Rail5V -->|VDD| A4988
        GPIO18 -->|STEP| A4988
        GPIO19 -->|DIR| A4988
        GPIO32 -->|ENABLE| A4988
        A4988 -->|1B Coil A+| NEMA17
        A4988 -->|1A Coil A-| NEMA17
        A4988 -->|2B Coil B+| NEMA17
        A4988 -->|2A Coil B-| NEMA17
        A4988 -->|GND| GndBus
    end

    style ESP32 fill:#3b82f6,color:#fff
    style MainRail fill:#ef4444,color:#fff
    style Rail5V fill:#f59e0b,color:#fff
    style GndBus fill:#6b7280,color:#fff
```

## ESP32 GPIO Pinout Diagram

```mermaid
graph LR
    subgraph "ESP32 DevKit Pinout"
        subgraph "Left Side"
            EN[EN]
            VP[VP GPIO36]
            VN[VN GPIO39]
            G34[GPIO34]
            G35[GPIO35]
            G32[GPIO32 - STEPPER ENABLE]
            G33[GPIO33]
            G25[GPIO25]
            G26[GPIO26 - HEATER RELAY]
            G27[GPIO27 - INT FAN RELAY]
            G14[GPIO14 - SOLAR FANS]
            G12[GPIO12 - SERVO 1]
            G13[GPIO13 - SERVO 2]
            GND1[GND]
            VIN[VIN]
        end

        subgraph "Right Side"
            G23[GPIO23 - SOLENOID]
            G22[GPIO22 - I2C SCL]
            TX[TX GPIO1]
            RX[RX GPIO3]
            G21[GPIO21 - I2C SDA]
            G19[GPIO19 - STEPPER DIR]
            G18[GPIO18 - STEPPER STEP]
            G5[GPIO5]
            G17[GPIO17]
            G16[GPIO16]
            G4[GPIO4 - DHT11]
            G0[GPIO0]
            G2[GPIO2]
            G15[GPIO15]
            GND2[GND]
            V3[3.3V]
        end
    end

    G32 -.-> StepperEnable[To A4988 ENABLE]
    G26 -.-> HeaterRelay[To Relay #1 Coil]
    G27 -.-> FanRelay[To Relay #2 Coil]
    G14 -.-> SolarRelay[To Relay #3 Coil]
    G12 -.-> Servo1Sig[To Servo 1 Signal]
    G13 -.-> Servo2Sig[To Servo 2 Signal]
    G23 -.-> SolenoidRelay[To Relay #4 Coil]
    G22 -.-> LCDSCL[To LCD SCL]
    G21 -.-> LCDSDA[To LCD SDA]
    G19 -.-> StepperDIR[To A4988 DIR]
    G18 -.-> StepperSTEP[To A4988 STEP]
    G4 -.-> DHT11Data[To DHT11 Data Pin]

    style G32 fill:#8b5cf6,color:#fff
    style G26 fill:#ef4444,color:#fff
    style G27 fill:#3b82f6,color:#fff
    style G14 fill:#f59e0b,color:#fff
    style G12 fill:#10b981,color:#fff
    style G13 fill:#10b981,color:#fff
    style G23 fill:#06b6d4,color:#fff
    style G22 fill:#ec4899,color:#fff
    style G21 fill:#ec4899,color:#fff
    style G19 fill:#8b5cf6,color:#fff
    style G18 fill:#8b5cf6,color:#fff
    style G4 fill:#f59e0b,color:#fff
```

## Power Distribution Network

```mermaid
graph TD
    Solar[Solar Inverter<br/>12V DC Primary Power]
    Grid[Grid Adapter<br/>12V DC Backup Power]

    Solar -->|12V +| F1[25A Fuse<br/>Inline]
    Grid -->|12V +| F2[25A Fuse<br/>Inline]

    F1 --> PR[12V 30A SL-C<br/>Power Switching Relay<br/>Terminal 85]
    F2 --> PRCOM[Power Relay<br/>COM Terminal 30]

    ESP32GPIO[ESP32 GPIO25] -->|Control| Trans[2N2222 NPN<br/>Transistor Base]
    Trans -->|Collector| PR
    Trans -->|Emitter| GND

    PRCOM -->|NO Terminal 87| C1[1000µF 16V<br/>Filter Capacitor]
    C1 --> C2[1000µF 16V<br/>Filter Capacitor<br/>Parallel]
    C2 --> Main12V[Main 12V Rail<br/>16 AWG Wire]

    Main12V --> RegInput[LM7805 INPUT<br/>or Buck Converter]
    RegInput --> RegOut[Regulator OUTPUT<br/>+5V]
    RegOut --> Rail5V[5V Rail<br/>For ESP32, LCD,<br/>Servos, Relays]

    Solar -->|GND| GndBus[Common Ground Bus<br/>14 AWG thick wire]
    Grid -->|GND| GndBus
    Main12V -.->|Ground Return| GndBus
    Rail5V -.->|Ground Return| GndBus

    style Main12V fill:#ef4444,color:#fff
    style Rail5V fill:#f59e0b,color:#fff
    style GndBus fill:#6b7280,color:#fff
    style Solar fill:#fbbf24
    style Grid fill:#3b82f6,color:#fff
```

## Relay Module Wiring Pattern (All 4 Relays)

```mermaid
graph TB
    subgraph "Standard Relay Module Wiring"
        V5[5V Rail] -->|Coil +| RelayCoil[Relay Coil<br/>JQC3F-05VDC-C]
        GPIO[ESP32 GPIO] -->|Control| RelayCoil
        FlybackDiode[1N4007 Diode<br/>Cathode to +<br/>Anode to GPIO] -.->|Protection| RelayCoil
        RelayCoil -->|Coil -| GND[Ground]

        Main12V[Main 12V Rail] -->|Power| COM[COM Terminal]
        COM -->|Switch| NO[NO Terminal<br/>Normally Open]
        NO --> Load[Load Device<br/>Heater/Fan/Solenoid]
        Load --> GND
    end

    subgraph "Relay Assignments"
        R1[Relay #1:<br/>GPIO26<br/>Heater Element]
        R2[Relay #2:<br/>GPIO27<br/>Internal Fan]
        R3[Relay #3:<br/>GPIO14<br/>Solar Fans × 2]
        R4[Relay #4:<br/>GPIO23<br/>Solenoid Valve]
    end

    style Main12V fill:#ef4444,color:#fff
    style V5 fill:#f59e0b,color:#fff
    style FlybackDiode fill:#10b981,color:#fff
```

## A4988 Stepper Driver Wiring

```mermaid
graph TB
    subgraph "A4988 Driver Module"
        subgraph "Power Connections"
            Main12V[Main 12V Rail] -->|VMOT| VMOT[VMOT Pin]
            VMOT --> Cap[100µF 16V<br/>Decoupling Cap]
            Cap --> VMOTGND[VMOT GND]
            VMOTGND --> GndBus[Ground Bus]

            Rail5V[5V Rail] -->|VDD| VDD[VDD Pin<br/>Logic Power]
            VDD --> VDDGND[VDD GND]
            VDDGND --> GndBus
        end

        subgraph "Control Signals"
            GPIO18[ESP32 GPIO18] -->|Pulse Train| STEP[STEP Pin]
            GPIO19[ESP32 GPIO19] -->|Direction| DIR[DIR Pin]
            GPIO32[ESP32 GPIO32] -->|Enable| ENABLE[ENABLE Pin<br/>LOW = ON]
            RESET[RESET Pin] <-->|Tied Together| SLEEP[SLEEP Pin]
        end

        subgraph "Microstepping Pins"
            MS1[MS1] -->|GND for| FullStep[Full Step Mode]
            MS2[MS2] -->|GND for| FullStep
            MS3[MS3] -->|GND for| FullStep
        end

        subgraph "Motor Output"
            B1[1B Pin] -->|Coil A+| CoilA+[Red Wire]
            A1[1A Pin] -->|Coil A-| CoilA-[Green Wire]
            B2[2B Pin] -->|Coil B+| CoilB+[Blue Wire]
            A2[2A Pin] -->|Coil B-| CoilB-[Yellow Wire]

            CoilA+ --> NEMA17[NEMA17<br/>Stepper Motor]
            CoilA- --> NEMA17
            CoilB+ --> NEMA17
            CoilB- --> NEMA17
        end

        subgraph "Current Adjustment"
            POT[Potentiometer<br/>Vref = 0.6V<br/>for 1.5A motor]
        end
    end

    style Main12V fill:#ef4444,color:#fff
    style Rail5V fill:#f59e0b,color:#fff
    style NEMA17 fill:#8b5cf6,color:#fff
    style POT fill:#f59e0b,color:#000
```

## DHT11 Sensor Wiring

```mermaid
graph LR
    subgraph "DHT11 Temperature & Humidity Sensor"
        VCC[VCC Pin] <-->|3.3V| ESP323V[ESP32 3.3V Pin]
        DATA[DATA Pin] <--> GPIO4[ESP32 GPIO4]
        GND[GND Pin] <--> GNDBUS[Ground Bus]
        NC[NC Pin<br/>Not Connected]

        PullUp[10kΩ Resistor<br/>Pull-up] -->|Between| DATA
        PullUp -->|and| VCC
    end

    Note[Note: DHT11 is 3.3V tolerant.<br/>Connect VCC to 3.3V NOT 5V.<br/>Data pin requires 10kΩ<br/>pull-up resistor to VCC]

    style VCC fill:#f59e0b,color:#fff
    style DATA fill:#3b82f6,color:#fff
    style GND fill:#6b7280,color:#fff
    style PullUp fill:#10b981,color:#fff
```

## I2C LCD 16x2 Wiring

```mermaid
graph LR
    subgraph "I2C LCD 16x2 Display"
        LCDVCC[VCC] <-->|5V| Rail5V[5V Rail]
        LCDGND[GND] <--> GndBus[Ground Bus]
        LCDSDA[SDA] <--> GPIO21[ESP32 GPIO21<br/>I2C Data]
        LCDSCL[SCL] <--> GPIO22[ESP32 GPIO22<br/>I2C Clock]
    end

    subgraph "I2C Address"
        ADDR[Default Address:<br/>0x27 or 0x3F<br/>Scan if display<br/>doesn't work]
    end

    Note[Note: LCD requires 5V power.<br/>I2C signals are 3.3V tolerant.<br/>Most I2C LCD modules have<br/>built-in level shifters]

    style LCDVCC fill:#f59e0b,color:#fff
    style LCDSDA fill:#ec4899,color:#fff
    style LCDSCL fill:#ec4899,color:#fff
    style LCDGND fill:#6b7280,color:#fff
```

## Servo Motor Wiring (SG90)

```mermaid
graph TB
    subgraph "Servo #1 - Solar Inlet Flap"
        S1Red[Red Wire<br/>Power] <--> Rail5V[5V Rail]
        S1Orange[Orange/Yellow<br/>Signal] <--> GPIO12[ESP32 GPIO12<br/>PWM 50Hz]
        S1Brown[Brown/Black<br/>Ground] <--> GndBus[Ground Bus]
        Cap1[100µF 16V<br/>Decoupling Cap<br/>across Power] -.-> S1Red
        Cap1 -.-> S1Brown
    end

    subgraph "Servo #2 - Top Vent"
        S2Red[Red Wire<br/>Power] <--> Rail5V
        S2Orange[Orange/Yellow<br/>Signal] <--> GPIO13[ESP32 GPIO13<br/>PWM 50Hz]
        S2Brown[Brown/Black<br/>Ground] <--> GndBus
        Cap2[100µF 16V<br/>Decoupling Cap<br/>across Power] -.-> S2Red
        Cap2 -.-> S2Brown
    end

    Note[Note: Each servo draws<br/>100-200mA during movement.<br/>Decoupling capacitors<br/>prevent power dips.<br/>PWM: 50Hz, 1ms=0°, 2ms=180°]

    style Rail5V fill:#f59e0b,color:#fff
    style GPIO12 fill:#10b981,color:#fff
    style GPIO13 fill:#10b981,color:#fff
    style GndBus fill:#6b7280,color:#fff
```

## Solenoid Valve Wiring with Protection

```mermaid
graph TB
    subgraph "Solenoid Valve Circuit"
        Main12V[Main 12V Rail] -->|COM| Relay4[Relay #4<br/>JQC3F]
        Relay4 -->|NO| SolPos[Solenoid +<br/>Red Wire]
        SolPos --> Solenoid[12V Solenoid Valve<br/>1/4 inch<br/>Water Control]
        Solenoid -->|Black Wire| SolNeg[Solenoid -]
        SolNeg --> GndBus[Ground Bus]

        FlybackDiode[1N4007 Diode<br/>Cathode to +<br/>Anode to -] -.->|Inductive<br/>Kickback<br/>Protection| Solenoid

        RelayControl[ESP32 GPIO23] -->|Control| Relay4Coil[Relay Coil]
        Rail5V[5V Rail] -->|Coil +| Relay4Coil
        Relay4Coil -->|Coil -| GndBus
    end

    Note[Note: Solenoid is inductive load.<br/>MUST have flyback diode.<br/>Pulse for 2-3 seconds<br/>to release water for humidity]

    style Main12V fill:#ef4444,color:#fff
    style Rail5V fill:#f59e0b,color:#fff
    style FlybackDiode fill:#10b981,color:#fff
    style Solenoid fill:#06b6d4,color:#fff
```

## Heater Circuit with Safety

```mermaid
graph TB
    subgraph "Heating Element Circuit"
        Main12V[Main 12V Rail] -->|COM| Relay1[Relay #1<br/>JQC3F]
        Relay1 -->|NO| ThermalFuse[77°C Thermal Fuse<br/>MANDATORY SAFETY]
        ThermalFuse --> HeaterPos[Heater +]
        HeaterPos --> Heater[Soldering Iron<br/>Element<br/>40-60W @ 12V<br/>Max 5A]
        Heater -->|Heater -| GndBus[Ground Bus]

        RelayControl[ESP32 GPIO26<br/>PWM for PID] -->|Control| Relay1Coil[Relay Coil]
        Rail5V[5V Rail] -->|Coil +| Relay1Coil
        Relay1Coil -->|Coil -| GndBus

        FlybackDiode[1N4007 Diode] -.->|Relay Coil<br/>Protection| Relay1Coil
    end

    Warning[⚠️ CRITICAL SAFETY:<br/>- 77°C thermal fuse is MANDATORY<br/>- Use 18 AWG wire minimum<br/>- Heater must be <60W @ 12V<br/>- Test thermal fuse before use]

    style Main12V fill:#ef4444,color:#fff
    style Rail5V fill:#f59e0b,color:#fff
    style ThermalFuse fill:#ef4444,color:#fff
    style Heater fill:#f59e0b,color:#000
    style Warning fill:#fef3c7,color:#92400e
```

---

## Wire Gauge Reference

| Circuit | Wire Gauge | Color Coding | Max Current |
|---------|----------|--------------|-------------|
| Main 12V Rails | 16 AWG | Red (+) / Black (-) | 10A |
| Heater Circuit | 18 AWG | Red (+) / Black (-) | 5A |
| Fan Circuits | 20-22 AWG | Red (+) / Black (-) | 0.5A |
| GPIO Signals | 22-24 AWG | Various | 40mA |
| Ground Bus | 14 AWG | Black or bare copper | 15A+ |
| I2C Signals | 24-26 AWG | Color coded | 1mA |

---

## Assembly Checklist

- [ ] Install both 25A fuses FIRST before any connections
- [ ] Set up common ground bus with 14 AWG wire
- [ ] Wire 5V regulator with input/output filter capacitors
- [ ] Connect ESP32 to 5V and verify power LED
- [ ] Install all 6 flyback diodes (4 relays + solenoid + heater relay)
- [ ] Wire DHT11 with 10kΩ pull-up resistor
- [ ] Connect I2C LCD (verify address with I2C scanner)
- [ ] Wire all 4 relay modules with proper protection
- [ ] Connect servos with decoupling capacitors
- [ ] Wire A4988 driver with 100µF capacitor
- [ ] Connect NEMA17 with correct coil pairs
- [ ] Install 77°C thermal fuse on heater circuit
- [ ] Test each subsystem before final assembly
- [ ] Verify all polarities with multimeter
- [ ] Cable management: separate high-current from signals

---

**⚠️ Safety Warning**: Always disconnect ALL power sources before working on the circuit. Double-check all connections before applying power. Test with loads disconnected first.
