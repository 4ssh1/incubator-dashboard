'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, useMargin } from 'recharts';

export default function TemperatureChart({ currentData }) {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    if (currentData?.temperature && currentData?.humidity) {
      setHistory(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          temperature: parseFloat(currentData.temperature.toFixed(1)),
          humidity: parseFloat(currentData.humidity.toFixed(1)),
          timestamp: Date.now()
        };
        
        const updated = [...prev, newPoint];
        // Keep last 50 points (or last hour of data)
        return updated.slice(-50);
      });
    }
  }, [currentData]);
  
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 pb-4 border-b-2 border-slate-200">
        Temperature & Humidity History
      </h2>
      
      {history.length > 0 ? (
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-2xl">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="time"
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #ddd',
                    borderRadius: '8px'
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Temperature (°C)"
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Humidity (%)"
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-300 border-t-slate-600 mb-4"></div>
          <p className="text-lg text-gray-500 font-medium">Waiting for sensor data...</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600 text-center bg-slate-50 px-4 py-2 rounded-lg">
        Displaying last {history.length} readings
      </div>
    </div>
  );
}