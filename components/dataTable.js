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
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-100">Data Records</h2>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-blue-500 mb-4"></div>
          <p className="text-slate-400">Loading data...</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Data Records</h2>
        <button
          onClick={exportToCSV}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-700 border-b border-slate-600">
                <th className="px-4 py-3 text-left font-semibold text-slate-300 text-xs uppercase">Date & Time</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300 text-xs uppercase">Temp</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300 text-xs uppercase">Humidity</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300 text-xs uppercase">Heater</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300 text-xs uppercase">Fan</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300 text-xs uppercase">Fans</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300 text-xs uppercase">Uptime</th>
              </tr>
            </thead>
            <tbody>
              {readings.length > 0 ? (
                readings.map((reading, index) => (
                  <tr
                    key={reading.id}
                    className={`border-b border-slate-700 ${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750'} hover:bg-slate-700/50 transition-colors`}
                  >
                    <td className="px-4 py-3 text-slate-400 text-xs">{reading.savedAt}</td>
                    <td className="px-4 py-3 font-bold text-orange-400">{reading.temperature?.toFixed(1) || '--'}°</td>
                    <td className="px-4 py-3 font-bold text-blue-400">{reading.humidity?.toFixed(1) || '--'}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        reading.heater ? 'bg-orange-500/20 text-orange-300' : 'bg-slate-600/20 text-slate-400'
                      }`}>
                        {reading.heater ? 'ON' : 'OFF'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        reading.internal_fan ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-600/20 text-slate-400'
                      }`}>
                        {reading.internal_fan ? 'ON' : 'OFF'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        reading.solar_fans ? 'bg-yellow-500/20 text-yellow-300' : 'bg-slate-600/20 text-slate-400'
                      }`}>
                        {reading.solar_fans ? 'ON' : 'OFF'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{reading.uptime || '--'}s</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-400">
                    No data available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}