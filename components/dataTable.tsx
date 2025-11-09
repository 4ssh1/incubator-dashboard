'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase.config';
import { collection, query, orderBy, limit, onSnapshot, QueryDocumentSnapshot, DocumentData, Timestamp } from 'firebase/firestore';
import { Download, Database, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FirebaseReading {
  id: string;
  temperature?: number;
  humidity?: number;
  heater?: boolean;
  internal_fan?: boolean;
  solar_fans?: boolean;
  uptime?: number;
  savedAt: string;
}

export default function DataTable() {
  const [readings, setReadings] = useState<FirebaseReading[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [recordLimit, setRecordLimit] = useState<number>(20);

  useEffect(() => {
    const q = query(
      collection(db, 'sensor_readings'),
      orderBy('savedAt', 'desc'),
      limit(recordLimit)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const docData = doc.data();
        const savedAtTimestamp = docData.savedAt as Timestamp | undefined;

        return {
          id: doc.id,
          ...docData,
          savedAt: savedAtTimestamp?.toDate().toLocaleString() || 'N/A'
        } as FirebaseReading;
      });
      setReadings(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [recordLimit]);

  const exportToCSV = (): void => {
    const headers = ['Date', 'Temperature (°C)', 'Humidity (%)', 'Heater', 'Internal Fan', 'Solar Fans', 'Uptime (s)'];
    const csvData = readings.map(r => [
      r.savedAt,
      r.temperature,
      r.humidity,
      r.heater ? 'ON' : 'OFF',
      r.internal_fan ? 'ON' : 'OFF',
      r.solar_fans ? 'ON' : 'OFF',
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
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Data Records</h2>
          <p className="text-sm text-slate-400 mt-1">Firebase sensor history</p>
        </div>
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
              <Database className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-slate-400 mt-4">Loading Firebase data...</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Data Records</h2>
          <p className="text-sm text-slate-400 mt-1">Firestore database history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRecordLimit(recordLimit === 20 ? 50 : recordLimit === 50 ? 100 : 20)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            {recordLimit} records
          </Button>
          <Button
            onClick={exportToCSV}
            variant="success"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Timestamp</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Temp</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Humidity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Heater</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Int. Fan</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Solar Fans</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Uptime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readings.length > 0 ? (
                      readings.map((reading, index) => (
                        <tr
                          key={reading.id}
                          className={`border-b border-slate-800 transition-colors hover:bg-slate-800/50 ${
                            index % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/10'
                          }`}
                        >
                          <td className="px-4 py-3 text-xs text-slate-400 font-mono">{reading.savedAt}</td>
                          <td className="px-4 py-3 font-bold text-orange-400">{reading.temperature?.toFixed(1) || '--'}°</td>
                          <td className="px-4 py-3 font-bold text-blue-400">{reading.humidity?.toFixed(1) || '--'}%</td>
                          <td className="px-4 py-3">
                            <Badge variant={reading.heater ? 'warning' : 'secondary'} className="text-xs">
                              {reading.heater ? 'ON' : 'OFF'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={reading.internal_fan ? 'info' : 'secondary'} className="text-xs">
                              {reading.internal_fan ? 'ON' : 'OFF'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={reading.solar_fans ? 'warning' : 'secondary'} className="text-xs">
                              {reading.solar_fans ? 'ON' : 'OFF'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-slate-400 font-mono text-xs">{reading.uptime || '--'}s</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                          No data available yet. Start collecting sensor data.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <div className="grid gap-4">
            {readings.length > 0 ? (
              readings.map((reading) => (
                <Card key={reading.id} className="hover:border-slate-700 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base text-white">Reading #{reading.id.slice(-6)}</CardTitle>
                        <CardDescription className="text-xs font-mono mt-1">{reading.savedAt}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {reading.uptime || 0}s uptime
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Temperature</p>
                        <p className="text-lg font-bold text-orange-400">{reading.temperature?.toFixed(1) || '--'}°C</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Humidity</p>
                        <p className="text-lg font-bold text-blue-400">{reading.humidity?.toFixed(1) || '--'}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Heater</p>
                        <Badge variant={reading.heater ? 'warning' : 'secondary'}>{reading.heater ? 'ON' : 'OFF'}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Int. Fan</p>
                        <Badge variant={reading.internal_fan ? 'info' : 'secondary'}>{reading.internal_fan ? 'ON' : 'OFF'}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Solar Fans</p>
                        <Badge variant={reading.solar_fans ? 'warning' : 'secondary'}>{reading.solar_fans ? 'ON' : 'OFF'}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-slate-400">
                  No data available yet. Start collecting sensor data.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
