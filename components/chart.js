'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-green-500 pb-3">
        Temperature & Humidity History
      </h2>
      
      {history.length > 0 ? (
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
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <p className="text-lg">Waiting for sensor data...</p>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        Displaying last {history.length} readings
      </div>
    </div>
  );
}