'use client';

import { useState, useEffect, useCallback } from 'react';
import { initializeMQTT, publishCommand, onMessage } from '@/lib/mqtt';
import { db } from '@/firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import SensorDisplay from '@/components/sensors';
import ManualControls from '@/components/manualCtrl';
import ServoControls from '@/components/servoCtrl';
import TemperatureChart from '@/components/chart';
import DataTable from '@/components/dataTable';

export default function Dashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [status, setStatus] = useState('offline');
  const [lastSaved, setLastSaved] = useState(null);
  
  // Initialize MQTT connection
  useEffect(() => {
    const client = initializeMQTT();
    
    // Subscribe to MQTT messages
    const unsubscribe = onMessage((topic, data) => {
      if (topic === 'incubator/esp32/status') {
        setStatus(data.status);
      } else if (topic === 'incubator/esp32/sensors') {
        setSensorData(data);
        
        // Auto-save to Firebase every 30 seconds
        const now = Date.now();
        if (!lastSaved || (now - lastSaved) > 30000) {
          saveToFirebase(data);
          setLastSaved(now);
        }
      } else if (topic === 'incubator/esp32/response') {
        console.log('ESP32 Response:', data.message);
        // You can show notifications here if needed
      }
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [lastSaved]);
  
  // Save sensor reading to Firebase
  const saveToFirebase = async (data) => {
    try {
      await addDoc(collection(db, 'sensor_readings'), {
        ...data,
        savedAt: serverTimestamp()
      });
      console.log('✅ Data saved to Firebase');
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  };
  
  // Send command to ESP32
  const handleCommand = useCallback((command) => {
    publishCommand(command);
  }, []);
  
  // Manual save button
  const handleManualSave = () => {
    if (sensorData) {
      saveToFirebase(sensorData);
      alert('Data saved to Firebase!');
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Incubator Monitor</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time monitoring & control</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleManualSave}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Save Data
            </button>
            <div className={`px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 ${
              status === 'online'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-red-500/20 text-red-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              {status === 'online' ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <SensorDisplay data={sensorData} status={status} />
        <ManualControls data={sensorData} onCommand={handleCommand} />
        <ServoControls data={sensorData} onCommand={handleCommand} />
        <TemperatureChart currentData={sensorData} />
        <DataTable />
      </main>
    </div>
  );
}