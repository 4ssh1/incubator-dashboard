'use client';

import { Thermometer, Droplets, Clock, Wifi } from 'lucide-react';
import { SensorData, SystemStatus } from '@/types';

interface SensorDisplayProps {
  data: SensorData | null;
  status: SystemStatus;
}

export default function SensorDisplay({ data, status }: SensorDisplayProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-slate-100">Live Sensors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Thermometer className="text-orange-400" size={28} />
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              status === 'online' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {status === 'online' ? 'Live' : 'Offline'}
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-2">Temperature</p>
          <p className="text-4xl font-bold text-orange-400 mb-1">
            {data?.temperature ? `${data.temperature.toFixed(1)}°` : '--'}
          </p>
          <p className="text-xs text-slate-500">Target: 37.5°C ± 0.3°C</p>
        </div>

        {/* Humidity Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Droplets className="text-blue-400" size={28} />
            <Wifi className={status === 'online' ? 'text-emerald-400' : 'text-slate-500'} size={20} />
          </div>
          <p className="text-slate-400 text-sm mb-2">Humidity</p>
          <p className="text-4xl font-bold text-blue-400 mb-1">
            {data?.humidity ? `${data.humidity.toFixed(1)}%` : '--'}
          </p>
          <p className="text-xs text-slate-500">Target: 50-80% RH</p>
        </div>

        {/* Uptime Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="text-cyan-400" size={28} />
          </div>
          <p className="text-slate-400 text-sm mb-2">Uptime</p>
          <p className="text-4xl font-bold text-cyan-400 mb-1">
            {data?.uptime ? `${Math.floor(data.uptime / 60)}m` : '--'}
          </p>
          <p className="text-xs text-slate-500">Last: {data?.timestamp ? `${(data.timestamp / 1000).toFixed(0)}s ago` : '--'}</p>
        </div>

        {/* System Info Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <p className="text-slate-400 text-sm mb-4 font-semibold">System</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Signal</span>
              <span className="text-slate-200 font-semibold">{data?.rssi ? `${data.rssi} dBm` : '--'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Memory</span>
              <span className="text-slate-200 font-semibold">{data?.free_heap ? `${(data.free_heap / 1024).toFixed(0)} KB` : '--'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Heater</span>
              <span className={`font-semibold ${data?.heater ? 'text-orange-400' : 'text-slate-500'}`}>
                {data?.heater ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
