'use client';

import { useState, useEffect, useCallback } from 'react';
import { initializeMQTT, publishCommand, onMessage } from '@/lib/mqtt';
import { db } from '@/firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { SensorData, StatusMessage, ResponseMessage } from '@/types';
import { Save, Egg, Zap } from 'lucide-react';

import SensorDisplay from '@/components/sensors';
import ManualControls from '@/components/manualCtrl';
import ServoControls from '@/components/servoCtrl';
import TemperatureChart from '@/components/chart';
import DataTable from '@/components/dataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [status, setStatus] = useState<'online' | 'offline'>('offline');
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  // Initialize MQTT connection
  useEffect(() => {
    initializeMQTT();

    // Subscribe to MQTT messages
    const unsubscribe = onMessage((topic: string, data: SensorData | StatusMessage | ResponseMessage) => {
      if (topic === 'incubator/esp32/status') {
        setStatus((data as StatusMessage).status);
      } else if (topic === 'incubator/esp32/sensors') {
        setSensorData(data as SensorData);

        // Auto-save to Firebase every 30 seconds
        const now = Date.now();
        if (!lastSaved || (now - lastSaved) > 30000) {
          saveToFirebase(data as SensorData);
          setLastSaved(now);
        }
      } else if (topic === 'incubator/esp32/response') {
        console.log('ESP32 Response:', (data as ResponseMessage).message);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [lastSaved]);

  // Save sensor reading to Firebase
  const saveToFirebase = async (data: SensorData): Promise<void> => {
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
  const handleCommand = useCallback((command: Record<string, boolean | number>) => {
    publishCommand(command);
  }, []);

  // Manual save button
  const handleManualSave = (): void => {
    if (sensorData) {
      saveToFirebase(sensorData);
      alert('Data saved to Firebase!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20">
                <Egg className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Incubator Dashboard
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">ESP32 IoT Monitoring & Control</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleManualSave}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={!sensorData}
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save Data</span>
              </Button>

              <Separator orientation="vertical" className="h-8" />

              <div className="flex items-center gap-2">
                <Zap className={`h-4 w-4 ${status === 'online' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                <Badge variant={status === 'online' ? 'success' : 'destructive'} className="gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`}></span>
                  {status === 'online' ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <SensorDisplay data={sensorData} status={status} />
          <Separator className="my-8" />
          <ManualControls data={sensorData} onCommand={handleCommand} />
          <Separator className="my-8" />
          <ServoControls data={sensorData} onCommand={handleCommand} />
          <Separator className="my-8" />
          <TemperatureChart currentData={sensorData} />
          <Separator className="my-8" />
          <DataTable />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-900/30 backdrop-blur-xl mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              ESP32 Solar Egg Incubator • 30 Eggs • 21-Day Cycle
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Powered by Next.js & Firebase</span>
              <span>•</span>
              <span>Built with TypeScript</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
