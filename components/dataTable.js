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
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Historical Data</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-indigo-500 pb-3">
          Historical Data (Last 20 Records)
        </h2>
        <button
          onClick={exportToCSV}
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-green-600 transition-colors shadow-md"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-left font-bold text-gray-700">Date & Time</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Temp (°C)</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Humidity (%)</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Heater</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Int. Fan</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Solar Fans</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Uptime (s)</th>
            </tr>
          </thead>
          <tbody>
            {readings.length > 0 ? (
              readings.map((reading, index) => (
                <tr 
                  key={reading.id} 
                  className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3 text-gray-700">{reading.savedAt}</td>
                  <td className="px-4 py-3 font-semibold text-red-600">
                    {reading.temperature?.toFixed(1) || 'N/A'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    {reading.humidity?.toFixed(1) || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      reading.heater ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {reading.heater ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      reading.internal_fan ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {reading.internal_fan ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      reading.solar_fans ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {reading.solar_fans ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{reading.uptime || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  No data available yet. Start collecting data to see history.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}