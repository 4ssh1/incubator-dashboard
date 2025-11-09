'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SensorData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Activity } from 'lucide-react';

interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  timestamp: number;
}

interface TemperatureChartProps {
  currentData: SensorData | null;
}

export default function TemperatureChart({ currentData }: TemperatureChartProps) {
  const [history, setHistory] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (currentData?.temperature && currentData?.humidity) {
      setHistory(prev => {
        const newPoint: ChartDataPoint = {
          time: new Date().toLocaleTimeString(),
          temperature: parseFloat(currentData.temperature.toFixed(1)),
          humidity: parseFloat(currentData.humidity.toFixed(1)),
          timestamp: Date.now()
        };

        const updated = [...prev, newPoint];
        return updated.slice(-50);
      });
    }
  }, [currentData]);

  return (
    <section className="mb-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Historical Data</CardTitle>
                <p className="text-sm text-slate-400 mt-0.5">Real-time sensor trends</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Activity className="h-4 w-4" />
              <span>Last {history.length} readings</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="combined" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="combined">Combined</TabsTrigger>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="humidity">Humidity</TabsTrigger>
            </TabsList>

            <TabsContent value="combined" className="mt-0">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis
                      dataKey="time"
                      stroke="#94a3b8"
                      style={{ fontSize: '12px' }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      style={{ fontSize: '12px' }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#e2e8f0'
                      }}
                      labelStyle={{ color: '#cbd5e1' }}
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
                      activeDot={{ r: 4, fill: '#fb923c' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Humidity (%)"
                      dot={false}
                      activeDot={{ r: 4, fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[350px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-700 border-t-blue-500 mb-4"></div>
                  <p className="text-slate-400 text-sm">Waiting for sensor data...</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="temperature" className="mt-0">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: '12px' }} tickLine={false} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} tickLine={false} domain={[35, 40]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#e2e8f0'
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#fb923c"
                      strokeWidth={3}
                      name="Temperature (°C)"
                      dot={{ fill: '#fb923c', r: 2 }}
                      activeDot={{ r: 5, fill: '#fb923c' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[350px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-700 border-t-orange-500 mb-4"></div>
                  <p className="text-slate-400 text-sm">Waiting for sensor data...</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="humidity" className="mt-0">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: '12px' }} tickLine={false} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#e2e8f0'
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Humidity (%)"
                      dot={{ fill: '#3b82f6', r: 2 }}
                      activeDot={{ r: 5, fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[350px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-700 border-t-blue-500 mb-4"></div>
                  <p className="text-slate-400 text-sm">Waiting for sensor data...</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}
