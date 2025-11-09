// Global type definitions for the Incubator Dashboard

export interface SensorData {
  temperature: number;
  humidity: number;
  uptime: number;
  timestamp: number;
  rssi: number;
  free_heap: number;
  heater: boolean;
  fan?: boolean;
  solenoid?: boolean;
  servo1_angle?: number;
  servo2_angle?: number;
}

export interface ControlCommand {
  type: 'heater' | 'fan' | 'solenoid' | 'servo1' | 'servo2' | 'stepper';
  action: 'on' | 'off' | 'angle' | 'rotate';
  value?: number;
}

export interface MQTTMessage {
  topic: string;
  data: SensorData | { status: string } | { message: string };
}

export interface StatusMessage {
  status: 'online' | 'offline';
}

export interface ResponseMessage {
  message: string;
}

export type SystemStatus = 'online' | 'offline';

export interface FirebaseReading extends SensorData {
  savedAt: FirebaseTimestamp;
}

// Firebase timestamp type
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface ChartDataPoint {
  timestamp: string;
  temperature: number;
  humidity: number;
}
