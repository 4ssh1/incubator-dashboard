import mqtt from 'mqtt';

let client = null;
let latestSensorData = null;
let deviceStatus = 'offline';
let messageCallbacks = [];

export function initializeMQTT() {
  if (typeof window === 'undefined') return null; // Only run in browser
  
  if (!client) {
    const brokerUrl = `ws://${process.env.NEXT_PUBLIC_MQTT_BROKER}:8083/mqtt`; //WebSocket port
    
    console.log('🔌 Connecting to MQTT broker:', brokerUrl);
    
    client = mqtt.connect(brokerUrl, {
      clientId: 'NextJS_Dashboard_' + Math.random().toString(16).substr(2, 8),
      clean: true,
      reconnectPeriod: 5000,
    });
    
    client.on('connect', () => {
      console.log('✅ MQTT Connected');
      
      // Subscribe to topics
      client.subscribe('incubator/esp32/status', (err) => {
        if (!err) console.log('📡 Subscribed to status');
      });
      
      client.subscribe('incubator/esp32/sensors', (err) => {
        if (!err) console.log('📡 Subscribed to sensors');
      });
      
      client.subscribe('incubator/esp32/response', (err) => {
        if (!err) console.log('📡 Subscribed to response');
      });
    });
    
    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(`📩 ${topic}:`, data);
        
        if (topic === 'incubator/esp32/status') {
          deviceStatus = data.status;
        } else if (topic === 'incubator/esp32/sensors') {
          latestSensorData = data;
        }
        
        // Notify all callbacks
        messageCallbacks.forEach(callback => callback(topic, data));
        
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
      }
    });
    
    client.on('error', (error) => {
      console.error('MQTT Error:', error);
    });
    
    client.on('reconnect', () => {
      console.log('🔄 MQTT Reconnecting...');
    });
  }
  
  return client;
}

export function getMQTTClient() {
  return client;
}

export function getSensorData() {
  return {
    status: deviceStatus,
    data: latestSensorData
  };
}

export function publishCommand(command) {
  if (client && client.connected) {
    const topic = 'incubator/esp32/control';
    const message = JSON.stringify(command);
    
    client.publish(topic, message, { qos: 1 }, (error) => {
      if (error) {
        console.error('Failed to send command:', error);
      } else {
        console.log('🎮 Command sent:', command);
      }
    });
  } else {
    console.error('MQTT client not connected');
  }
}

export function onMessage(callback) {
  messageCallbacks.push(callback);
  
  // Return unsubscribe function
  return () => {
    messageCallbacks = messageCallbacks.filter(cb => cb !== callback);
  };
}