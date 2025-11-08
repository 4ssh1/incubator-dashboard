'use client';

import { Thermometer, Droplets, Clock, Wifi } from 'lucide-react';

export default function SensorDisplay({ data, status }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Temperature Card */}
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-red-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-red-100">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <Thermometer className="text-red-500" size={32} />
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
            status === 'online' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-red-100 text-red-700'
          }`}>
            {status === 'online' ? 'LIVE' : 'OFFLINE'}
          </div>
        </div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-3">Temperature</h3>
        <div className="text-5xl font-extrabold text-red-600 mb-2">
          {data?.temperature ? `${data.temperature.toFixed(1)}°C` : '--'}
        </div>
        <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg">
          Target: 37.5°C ± 0.3°C
        </div>
      </div>

      {/* Humidity Card */}
      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <Droplets className="text-blue-500" size={32} />
          </div>
          <Wifi className={status === 'online' ? 'text-green-500' : 'text-gray-400'} size={24} />
        </div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-3">Humidity</h3>
        <div className="text-5xl font-extrabold text-blue-600 mb-2">
          {data?.humidity ? `${data.humidity.toFixed(1)}%` : '--'}
        </div>
        <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg">
          Target: 50-80% RH
        </div>
      </div>

      {/* Uptime Card */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-emerald-100">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <Clock className="text-emerald-600" size={32} />
          </div>
        </div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-3">Uptime</h3>
        <div className="text-5xl font-extrabold text-emerald-600 mb-2">
          {data?.uptime ? `${Math.floor(data.uptime / 60)}m` : '--'}
        </div>
        <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg">
          Last: {data?.timestamp ? `${(data.timestamp / 1000).toFixed(0)}s` : '--'}
        </div>
      </div>

      {/* System Info Card */}
      <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200">
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-4">System Info</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg">
            <span className="text-gray-600 font-medium">Signal</span>
            <span className="font-bold text-slate-700">{data?.rssi ? `${data.rssi} dBm` : '--'}</span>
          </div>
          <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg">
            <span className="text-gray-600 font-medium">Memory</span>
            <span className="font-bold text-slate-700">{data?.free_heap ? `${(data.free_heap / 1024).toFixed(0)} KB` : '--'}</span>
          </div>
          <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg">
            <span className="text-gray-600 font-medium">Heater</span>
            <span className={`font-bold ${data?.heater ? 'text-orange-600' : 'text-gray-400'}`}>
              {data?.heater ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}