'use client';

import { Power, Fan, Wind, Droplets } from 'lucide-react';

export default function ManualControls({ data, onCommand }) {
  const handleToggle = (device) => {
    const command = { [device]: !data?.[device] };
    onCommand(command);
  };
  
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 pb-4 border-b-2 border-slate-200">
        Manual Controls
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Heater */}
        <button
          onClick={() => handleToggle('heater')}
          className={`p-8 rounded-2xl font-bold text-lg flex flex-col items-center gap-4 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl ${
            data?.heater
              ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
          }`}
        >
          <div className={`p-3 rounded-full ${
            data?.heater ? 'bg-white/20' : 'bg-white'
          }`}>
            <Power size={32} />
          </div>
          <span className="text-xl">Heater</span>
          <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
            data?.heater ? 'bg-white/20' : 'bg-gray-300'
          }`}>
            {data?.heater ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Internal Fan */}
        <button
          onClick={() => handleToggle('internal_fan')}
          className={`p-8 rounded-2xl font-bold text-lg flex flex-col items-center gap-4 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl ${
            data?.internal_fan
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
          }`}
        >
          <div className={`p-3 rounded-full ${
            data?.internal_fan ? 'bg-white/20' : 'bg-white'
          }`}>
            <Fan size={32} />
          </div>
          <span className="text-xl">Internal Fan</span>
          <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
            data?.internal_fan ? 'bg-white/20' : 'bg-gray-300'
          }`}>
            {data?.internal_fan ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Solar Fans */}
        <button
          onClick={() => handleToggle('solar_fans')}
          className={`p-8 rounded-2xl font-bold text-lg flex flex-col items-center gap-4 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl ${
            data?.solar_fans
              ? 'bg-gradient-to-br from-yellow-500 to-orange-400 text-white'
              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
          }`}
        >
          <div className={`p-3 rounded-full ${
            data?.solar_fans ? 'bg-white/20' : 'bg-white'
          }`}>
            <Wind size={32} />
          </div>
          <span className="text-xl">Solar Fans</span>
          <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
            data?.solar_fans ? 'bg-white/20' : 'bg-gray-300'
          }`}>
            {data?.solar_fans ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Solenoid Valve */}
        <button
          onClick={() => handleToggle('solenoid')}
          className={`p-8 rounded-2xl font-bold text-lg flex flex-col items-center gap-4 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl ${
            data?.solenoid
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
          }`}
        >
          <div className={`p-3 rounded-full ${
            data?.solenoid ? 'bg-white/20' : 'bg-white'
          }`}>
            <Droplets size={32} />
          </div>
          <span className="text-xl">Solenoid</span>
          <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
            data?.solenoid ? 'bg-white/20' : 'bg-gray-300'
          }`}>
            {data?.solenoid ? 'OPEN' : 'CLOSED'}
          </span>
        </button>
      </div>
    </div>
  );
}
