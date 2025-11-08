'use client';

import { Power, Fan, Wind, Droplets } from 'lucide-react';

export default function ManualControls({ data, onCommand }) {
  const handleToggle = (device) => {
    const command = { [device]: !data?.[device] };
    onCommand(command);
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-blue-500 pb-3">
        Manual Controls
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Heater */}
        <button
          onClick={() => handleToggle('heater')}
          className={`p-6 rounded-xl font-bold text-lg flex flex-col items-center gap-3 transition-all transform hover:scale-105 ${
            data?.heater 
              ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Power size={32} />
          <span>Heater</span>
          <span className="text-sm font-normal">
            {data?.heater ? 'ON' : 'OFF'}
          </span>
        </button>
        
        {/* Internal Fan */}
        <button
          onClick={() => handleToggle('internal_fan')}
          className={`p-6 rounded-xl font-bold text-lg flex flex-col items-center gap-3 transition-all transform hover:scale-105 ${
            data?.internal_fan 
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Fan size={32} />
          <span>Internal Fan</span>
          <span className="text-sm font-normal">
            {data?.internal_fan ? 'ON' : 'OFF'}
          </span>
        </button>
        
        {/* Solar Fans */}
        <button
          onClick={() => handleToggle('solar_fans')}
          className={`p-6 rounded-xl font-bold text-lg flex flex-col items-center gap-3 transition-all transform hover:scale-105 ${
            data?.solar_fans 
              ? 'bg-gradient-to-br from-yellow-500 to-orange-400 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Wind size={32} />
          <span>Solar Fans</span>
          <span className="text-sm font-normal">
            {data?.solar_fans ? 'ON' : 'OFF'}
          </span>
        </button>
        
        {/* Solenoid Valve */}
        <button
          onClick={() => handleToggle('solenoid')}
          className={`p-6 rounded-xl font-bold text-lg flex flex-col items-center gap-3 transition-all transform hover:scale-105 ${
            data?.solenoid 
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Droplets size={32} />
          <span>Solenoid</span>
          <span className="text-sm font-normal">
            {data?.solenoid ? 'OPEN' : 'CLOSED'}
          </span>
        </button>
      </div>
    </div>
  );
}
