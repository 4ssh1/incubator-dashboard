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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
                ESP32 Egg Incubator
              </h1>
              <p className="text-gray-600 text-lg">
                Real-time monitoring and control system with Firebase logging
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={handleManualSave}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
              >
                Save Now
              </button>
              <div className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
                status === 'online'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
              }`}>
                {status === 'online' ? 'ONLINE' : 'OFFLINE'}
              </div>
            </div>
          </div>
        </div>

        <SensorDisplay data={sensorData} status={status} />

        <ManualControls data={sensorData} onCommand={handleCommand} />

        <ServoControls data={sensorData} onCommand={handleCommand} />

        <TemperatureChart currentData={sensorData} />

        <DataTable />

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl shadow-md p-8 border border-gray-200">
          <p className="text-gray-700 text-center mb-2 text-lg">
            <span className="font-semibold">Tip:</span> Data is automatically saved to Firebase every 30 seconds. Use the "Save Now" button to save immediately.
          </p>
          <p className="text-sm text-gray-500 text-center">
            ESP32 Incubator Control System v1.0 | Next.js 15 + Firebase + MQTT
          </p>
        </div>
      </div>
    </div>
  );
}