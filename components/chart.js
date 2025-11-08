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
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-slate-100">History</h2>
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        {history.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px', color: '#cbd5e1' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#fb923c"
                  strokeWidth={2}
                  name="Temperature (°C)"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Humidity (%)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-400 text-center mt-4">
              Last {history.length} readings
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-blue-500 mb-4"></div>
            <p className="text-slate-400">Waiting for data...</p>
          </div>
        )}
      </div>
    </section>
  );
}