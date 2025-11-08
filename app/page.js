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
    <div className="min-h-screen bg-gray-50 w-full flex flex-col items-center py-10 px-5 ">
      <div className="w-[95%]">
        {/* Header */}
        <div className="bg-white h-52">
          <div className="flex flex-col justify-between items-center gap-5">
            <div className='px-5 '>
              <h1 className="text-4xl font-bold text-gray-800 leading-20">
                 ESP32 Egg Incubator Dashboard
              </h1>
              <p className="text-gray-600 mt-5">
                Real-time monitoring and control system with Firebase logging
              </p>
            </div>
            <div className="flex gap-4 w-[20rem] justify-between">
              <button
                onClick={handleManualSave}
                className="bg-blue-500 text-white inline-block rounded-lg w-30 font-bold hover:bg-blue-600 transition-colors shadow-md"
              >
                💾 Save Now
              </button>
              <div className={`px-6 inline-block py-3 rounded-full w-30 font-bold text-lg shadow-lg ${
                status === 'online' 
                  ? 'bg-green-500 text-white animate-pulse' 
                  : 'bg-red-500 text-white'
              }`}>
                {status === 'online' ? '🟢 ONLINE' : '🔴 OFFLINE'}
              </div>
            </div>
          </div>
        </div>
          <SensorDisplay data={sensorData} status={status} />

          {/* Manual Controls */}
            <div className='mt-5'>
              <ManualControls data={sensorData} onCommand={handleCommand} />
            </div>
        <div className='flex w-full'>          
          {/* Servo & Stepper Controls */}
            <ServoControls data={sensorData} onCommand={handleCommand} /> 
        </div>

        <div className='flex w-full'>
            {/* Temperature Chart */}
              <TemperatureChart currentData={sensorData} />
        </div>
          
          {/* Data Table */}
            <DataTable />
         
        {/* Footer */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-8 text-center">
          <p className="text-gray-600">
            💡 <strong>Tip:</strong> Data is automatically saved to Firebase every 30 seconds. 
            Use the "Save Now" button to save immediately.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            ESP32 Incubator Control System v1.0 | Next.js 15 + Firebase + MQTT
          </p>
        </div>
      </div>
    </div>
  );
}