'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase.config';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { Download } from 'lucide-react';

export default function DataTable() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Real-time listener for new readings
    const q = query(
      collection(db, 'sensor_readings'),
      orderBy('savedAt', 'desc'),
      limit(20)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        savedAt: doc.data().savedAt?.toDate().toLocaleString() || 'N/A'
      }));
      setReadings(data);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  const exportToCSV = () => {
    const headers = ['Date', 'Temperature (°C)', 'Humidity (%)', 'Heater', 'Fan', 'Uptime (s)'];
    const csvData = readings.map(r => [
      r.savedAt,
      r.temperature,
      r.humidity,
      r.heater ? 'ON' : 'OFF',
      r.internal_fan ? 'ON' : 'OFF',
      r.uptime
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incubator_data_${Date.now()}.csv`;
    a.click();
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 pb-4 border-b-2 border-slate-200">Historical Data</h2>
        <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-300 border-t-slate-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-slate-800 pb-2 border-b-2 border-slate-200">
          Historical Data
          <span className="text-lg font-normal text-gray-500 ml-3">(Last 20 Records)</span>
        </h2>
        <button
          onClick={exportToCSV}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
        >
          <Download size={22} />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-slate-100 to-gray-100 border-b-2 border-slate-300">
              <th className="px-6 py-4 text-left font-bold text-gray-800 uppercase text-xs tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-left font-bold text-gray-800 uppercase text-xs tracking-wider">Temp</th>
              <th className="px-6 py-4 text-left font-bold text-gray-800 uppercase text-xs tracking-wider">Humidity</th>
              <th className="px-6 py-4 text-left font-bold text-gray-800 uppercase text-xs tracking-wider">Heater</th>
              <th className="px-6 py-4 text-left font-bold text-gray-800 uppercase text-xs tracking-wider">Int. Fan</th>
              <th className="px-6 py-4 text-left font-bold text-gray-800 uppercase text-xs tracking-wider">Solar Fans</th>
              <th className="px-6 py-4 text-left font-bold text-gray-800 uppercase text-xs tracking-wider">Uptime</th>
            </tr>
          </thead>
          <tbody>
            {readings.length > 0 ? (
              readings.map((reading, index) => (
                <tr
                  key={reading.id}
                  className={`border-b border-slate-200 hover:bg-white/60 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                >
                  <td className="px-6 py-4 text-gray-700 font-medium">{reading.savedAt}</td>
                  <td className="px-6 py-4 font-bold text-red-600 text-base">
                    {reading.temperature?.toFixed(1) || 'N/A'}°C
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-600 text-base">
                    {reading.humidity?.toFixed(1) || 'N/A'}%
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                      reading.heater ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {reading.heater ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                      reading.internal_fan ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {reading.internal_fan ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                      reading.solar_fans ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {reading.solar_fans ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{reading.uptime || 'N/A'}s</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-gray-400 text-5xl">📊</div>
                    <p className="text-gray-600 font-medium text-lg">No data available yet</p>
                    <p className="text-gray-500 text-sm">Start collecting data to see history</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}