'use client';

import { useState } from 'react';
import { RotateCw, Gauge } from 'lucide-react';

export default function ServoControls({ data, onCommand }) {
  const [solarInlet, setSolarInlet] = useState(0);
  const [topVent, setTopVent] = useState(0);
  const [interval, setInterval] = useState(5000);
  
  const handleServoChange = (servo, value) => {
    const command = { [servo]: parseInt(value) };
    onCommand(command);
  };
  
  const handleTurnEggs = () => {
    onCommand({ turn_eggs: true });
  };
  
  const handleIntervalUpdate = () => {
    const newInterval = parseInt(interval);
    if (newInterval >= 1000 && newInterval <= 60000) {
      onCommand({ interval: newInterval });
    } else {
      alert('Interval must be between 1000 and 60000 milliseconds');
    }
  };
  
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 pb-4 border-b-2 border-slate-200">
        Servo & Stepper Controls
      </h2>

      {/* Servo Controls */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Solar Inlet Flap */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-2xl shadow-md border border-orange-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <Gauge className="text-orange-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Solar Inlet Flap</h3>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            value={data?.solar_inlet_angle || solarInlet}
            onChange={(e) => {
              setSolarInlet(e.target.value);
              handleServoChange('solar_inlet', e.target.value);
            }}
            className="w-full h-4 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600 shadow-inner"
          />
          <div className="flex justify-between items-center mt-6 bg-white px-4 py-3 rounded-xl shadow-sm">
            <span className="text-sm font-medium text-gray-600">0°</span>
            <span className="text-3xl font-extrabold text-orange-600">
              {data?.solar_inlet_angle || solarInlet}°
            </span>
            <span className="text-sm font-medium text-gray-600">180°</span>
          </div>
        </div>

        {/* Top Vent */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-md border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <Gauge className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Top Vent</h3>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            value={data?.top_vent_angle || topVent}
            onChange={(e) => {
              setTopVent(e.target.value);
              handleServoChange('top_vent', e.target.value);
            }}
            className="w-full h-4 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600 shadow-inner"
          />
          <div className="flex justify-between items-center mt-6 bg-white px-4 py-3 rounded-xl shadow-sm">
            <span className="text-sm font-medium text-gray-600">0°</span>
            <span className="text-3xl font-extrabold text-blue-600">
              {data?.top_vent_angle || topVent}°
            </span>
            <span className="text-sm font-medium text-gray-600">180°</span>
          </div>
        </div>
      </div>

      {/* Stepper Motor Control */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-8 rounded-2xl shadow-md border border-slate-200">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <button
            onClick={handleTurnEggs}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-4 hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
          >
            <RotateCw size={28} />
            Turn Eggs Manually
          </button>

          {/* Interval Control */}
          <div className="flex-1 w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Sensor Update Interval</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="number"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="px-6 py-4 border-2 border-gray-300 rounded-xl font-mono text-lg focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 shadow-sm"
                placeholder="5000"
                min="1000"
                max="60000"
              />
              <span className="text-gray-600 font-semibold whitespace-nowrap">milliseconds</span>
              <button
                onClick={handleIntervalUpdate}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-teal-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
              >
                Update
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Valid range: 1000 - 60000 ms (1 second to 1 minute)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}