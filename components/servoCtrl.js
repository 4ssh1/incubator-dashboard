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
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-slate-100">Servo & Motion</h2>

      {/* Servo Controls */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Solar Inlet Flap */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Gauge className="text-orange-400" size={24} />
            <h3 className="font-semibold text-slate-100">Solar Inlet</h3>
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
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-400"
          />
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-slate-400">0°</span>
            <span className="text-2xl font-bold text-orange-400">
              {data?.solar_inlet_angle || solarInlet}°
            </span>
            <span className="text-slate-400">180°</span>
          </div>
        </div>

        {/* Top Vent */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Gauge className="text-blue-400" size={24} />
            <h3 className="font-semibold text-slate-100">Top Vent</h3>
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
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
          />
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-slate-400">0°</span>
            <span className="text-2xl font-bold text-blue-400">
              {data?.top_vent_angle || topVent}°
            </span>
            <span className="text-slate-400">180°</span>
          </div>
        </div>
      </div>

      {/* Stepper Motor Control */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <button
          onClick={handleTurnEggs}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors mb-6"
        >
          <RotateCw size={24} />
          Turn Eggs
        </button>

        {/* Interval Control */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Update Interval (ms)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 font-mono text-sm focus:border-blue-500 focus:outline-none"
              placeholder="5000"
              min="1000"
              max="60000"
            />
            <button
              onClick={handleIntervalUpdate}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Update
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Range: 1000-60000 ms (1 sec - 1 min)
          </p>
        </div>
      </div>
    </section>
  );
}