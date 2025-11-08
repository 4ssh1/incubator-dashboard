'use client';

import { Thermometer, Droplets, Clock, Wifi } from 'lucide-react';

export default function SensorDisplay({ data, status }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-8 gap-8 h-[25vh]">
      {/* Temperature Card */}
      <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-lg shadow-lg  hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <Thermometer className="text-red-500" size={36} />
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {status === 'online' ? '● LIVE' : '● OFFLINE'}
          </div>
        </div>
        <h3 className="text-gray-600 text-sm font-semibold mb-2">TEMPERATURE</h3>
        <div className="text-4xl font-bold text-gray-800">
          {data?.temperature ? `${data.temperature.toFixed(1)}°C` : '--'}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Target: 37.5°C ± 0.3°C
        </div>
      </div>
      
      {/* Humidity Card */}
      <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <Droplets className="text-blue-500" size={36} />
          <Wifi className={status === 'online' ? 'text-green-500' : 'text-gray-400'} size={20} />
        </div>
        <h3 className="text-gray-600 text-sm font-semibold mb-2">HUMIDITY</h3>
        <div className="text-4xl font-bold text-gray-800">
          {data?.humidity ? `${data.humidity.toFixed(1)}%` : '--'}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Target: 50-80% RH
        </div>
      </div>
      
      {/* Uptime Card */}
      <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <Clock className="text-purple-500" size={36} />
        </div>
        <h3 className="text-gray-600 text-sm font-semibold mb-2">UPTIME</h3>
        <div className="text-4xl font-bold text-gray-800">
          {data?.uptime ? `${Math.floor(data.uptime / 60)}m` : '--'}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Last update: {data?.timestamp ? `${(data.timestamp / 1000).toFixed(0)}s` : '--'}
        </div>
      </div>
      
      {/* System Info Card */}
      <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <h3 className="text-gray-600 text-sm font-semibold mb-4">SYSTEM INFO</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between mb-5">
            <span className="text-gray-600">Signal:</span>
            <span className="font-bold">{data?.rssi ? `${data.rssi} dBm` : '--'}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-600">Memory:</span>
            <span className="font-bold">{data?.free_heap ? `${(data.free_heap / 1024).toFixed(0)} KB` : '--'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Heater:</span>
            <span className={`font-bold ${data?.heater ? 'text-orange-600' : 'text-gray-400'}`}>
              {data?.heater ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}