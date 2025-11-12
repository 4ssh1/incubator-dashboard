import mqtt, { MqttClient } from 'mqtt';
import { SensorData, StatusMessage, ResponseMessage } from '@/types';

let client: MqttClient | null = null;
let latestSensorData: SensorData | null = null;
let deviceStatus: 'online' | 'offline' = 'offline';
let messageCallbacks: Array<(topic: string, data: SensorData | StatusMessage | ResponseMessage) => void> = [];

export function initializeMQTT(): MqttClient | null {
  if (typeof window === 'undefined') return null;

  if (!client) {
    // FIXED: Use correct HiveMQ public broker WebSocket URL
    const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt'; // Secure WebSocket

    console.log('🔌 Connecting to MQTT broker:', brokerUrl);

    client = mqtt.connect(brokerUrl, {
      clientId: 'NextJS_Dashboard_' + Math.random().toString(16).substring(2, 8),
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 30000, // 30 seconds timeout
    });

    client.on('connect', () => {
      console.log('✅ MQTT Connected to HiveMQ');
      console.log('📡 Client ID:', client?.options.clientId);

      // Subscribe to topics
      const topics = [
        'incubator/esp32/status',
        'incubator/esp32/sensors',
        'incubator/esp32/response'
      ];

      topics.forEach(topic => {
        client?.subscribe(topic, { qos: 1 }, (err) => {
          if (err) {
            console.error(`❌ Failed to subscribe to ${topic}:`, err);
          } else {
            console.log(`✅ Subscribed to ${topic}`);
          }
        });
      });
    });

    client.on('message', (topic: string, message: Buffer) => {
      try {
        const messageStr = message.toString();
        console.log(`📩 Raw message from ${topic}:`, messageStr);
        
        const data = JSON.parse(messageStr) as SensorData | StatusMessage | ResponseMessage;
        console.log(`📊 Parsed data from ${topic}:`, data);

        if (topic === 'incubator/esp32/status') {
          const statusMsg = data as StatusMessage;
          deviceStatus = statusMsg.status;
          console.log('🔔 Device status updated:', deviceStatus);
        } else if (topic === 'incubator/esp32/sensors') {
          latestSensorData = data as SensorData;
          console.log('🌡️ Sensor data updated:', {
            temp: latestSensorData.temperature,
            humidity: latestSensorData.humidity,
            timestamp: latestSensorData.timestamp
          });
        }

        // Notify all callbacks
        messageCallbacks.forEach(callback => {
          try {
            callback(topic, data);
          } catch (callbackError) {
            console.error('Error in message callback:', callbackError);
          }
        });

      } catch (error) {
        console.error('❌ Error parsing MQTT message:', error);
        console.error('Raw message:', message.toString());
      }
    });

    client.on('error', (error: Error) => {
      console.error('❌ MQTT Error:', error);
    });

    client.on('reconnect', () => {
      console.log('🔄 MQTT Reconnecting...');
    });

    client.on('offline', () => {
      console.log('⚠️ MQTT Client Offline');
      deviceStatus = 'offline';
    });

    client.on('close', () => {
      console.log('🔌 MQTT Connection Closed');
    });
  }

  return client;
}

export function getMQTTClient(): MqttClient | null {
  return client;
}

export function getSensorData(): {
  status: 'online' | 'offline';
  data: SensorData | null;
} {
  console.log('📊 Getting sensor data:', {
    status: deviceStatus,
    hasData: !!latestSensorData,
    data: latestSensorData
  });
  
  return {
    status: deviceStatus,
    data: latestSensorData
  };
}

export function publishCommand(command: Record<string, boolean | number | string>): void {
  if (client && client.connected) {
    const topic = 'incubator/esp32/control';
    const message = JSON.stringify(command);

    console.log('🎮 Sending command to', topic, ':', command);

    client.publish(topic, message, { qos: 1 }, (error) => {
      if (error) {
        console.error('❌ Failed to send command:', error);
      } else {
        console.log('✅ Command sent successfully:', command);
      }
    });
  } else {
    console.error('❌ MQTT client not connected. Status:', {
      clientExists: !!client,
      connected: client?.connected
    });
  }
}

export function onMessage(
  callback: (topic: string, data: SensorData | StatusMessage | ResponseMessage) => void
): () => void {
  messageCallbacks.push(callback);
  console.log('📝 Message callback registered. Total callbacks:', messageCallbacks.length);

  // Return unsubscribe function
  return () => {
    messageCallbacks = messageCallbacks.filter(cb => cb !== callback);
    console.log('📝 Message callback unregistered. Remaining:', messageCallbacks.length);
  };
}

export function disconnectMQTT(): void {
  if (client) {
    console.log('🔌 Disconnecting MQTT client...');
    client.end();
    client = null;
    deviceStatus = 'offline';
    latestSensorData = null;
    messageCallbacks = [];
  }
}