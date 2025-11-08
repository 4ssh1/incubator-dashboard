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
    <div className="bg-white p-8 mb-8 h-[50vh] w-full mt-5">
      <div className="h-[50vh] flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4  pb-3 leading-20">
            Servo & Stepper Controls
          </h2>
          
          {/* Servo Controls */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 ">
            {/* Solar Inlet Flap */}
            <div className="bg-linear-to-r from-orange-100 to-yellow-100 p-6 rounded-xl h-[20vh] flex flex-col gap-5">
              <div className="flex items-center gap-3 mb-2">
                <Gauge className="text-orange-600" size={28} />
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
                className="w-full h-3 bg-orange-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between mt-3 text-sm text-gray-600">
                <span>0°</span>
                <span className="text-2xl font-bold text-orange-600">
                  {data?.solar_inlet_angle || solarInlet}°
                </span>
                <span>180°</span>
              </div>
            </div>
          
            {/* Top Vent */}
            <div className="bg-linear-to-r from-blue-100 to-cyan-100 p-6 rounded-xl flex flex-col gap-5">
              <div className="flex items-center gap-3 mb-4">
                <Gauge className="text-blue-600" size={28} />
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
                className="w-full h-3 bg-blue-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between mt-3 text-sm text-gray-600">
                <span>0°</span>
                <span className="text-2xl font-bold text-blue-600">
                  {data?.top_vent_angle || topVent}°
                </span>
                <span>180°</span>
              </div>
            </div>
          </div>
      </div>
      
      {/* Stepper Motor Control */}
    <div className='h-[80vh] w-full border-2 flex flex-col'>
          <div className="flex justify-center">
            <div className='bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl flex'>
                <button
                  onClick={handleTurnEggs}
                  className=" text-white px-12 py-6 rounded-2xl font-bold text-sm flex items-center gap-4 hover:scale-105 transition-transform shadow-xl hover:shadow-2xl"
                >
                  <RotateCw size={25} />
                  Turn Eggs Manually
                </button>
            </div>
          </div>
      
        {/* Interval Control */}
        <div >
            <div className="bg-linear-to-r from-gray-100 to-gray-200 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Sensor Update Interval</h3>
                <div className="flex items-center gap-4">
                <input
                    type="number"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-lg focus:border-purple-500 focus:outline-none inline-block"
                    placeholder="5000"
                    min="1000"
                    max="60000"
                    />
                <span className="text-gray-600 font-semibold">milliseconds</span>
                <button
                    onClick={handleIntervalUpdate}
                    className="bg-purple-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors shadow-md"
                    >
                    Update
                </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                Valid range: 1000 - 60000 ms (1 second to 1 minute)
                </p>
            </div>
        </div>
    </div>
    </div>
  );
}