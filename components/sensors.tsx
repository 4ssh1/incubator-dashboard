'use client';

import { Thermometer, Droplets, Clock, Cpu, Signal, HardDrive } from 'lucide-react';
import { SensorData, SystemStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SensorDisplayProps {
  data: SensorData | null;
  status: SystemStatus;
}

export default function SensorDisplay({ data, status }: SensorDisplayProps) {
  const getStatusColor = () => {
    if (status === 'online') return 'success';
    return 'destructive';
  };

  const getTempStatus = () => {
    if (!data?.temperature) return 'secondary';
    if (data.temperature >= 37.2 && data.temperature <= 37.8) return 'success';
    if (data.temperature < 36.5 || data.temperature > 38.5) return 'destructive';
    return 'warning';
  };

  const getHumidityStatus = () => {
    if (!data?.humidity) return 'secondary';
    if (data.humidity >= 50 && data.humidity <= 80) return 'success';
    if (data.humidity < 40 || data.humidity > 85) return 'destructive';
    return 'warning';
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Live Sensors</h2>
        <Badge variant={getStatusColor()}>
          <span className={`w-2 h-2 rounded-full mr-2 ${status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
          {status === 'online' ? 'Online' : 'Offline'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Temperature Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Temperature</CardTitle>
            <Thermometer className="h-5 w-5 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-4xl font-bold text-orange-400">
                {data?.temperature ? data.temperature.toFixed(1) : '--'}
              </div>
              <div className="text-slate-500 mb-1">°C</div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Target: 37.5°C ± 0.3</span>
              <Badge variant={getTempStatus()} className="text-[10px] px-1.5 py-0">
                {getTempStatus() === 'success' ? 'Optimal' : getTempStatus() === 'warning' ? 'Monitor' : 'Alert'}
              </Badge>
            </div>
            {data?.temperature && (
              <Progress
                value={Math.min((data.temperature / 50) * 100, 100)}
                className="mt-3 h-1"
              />
            )}
          </CardContent>
        </Card>

        {/* Humidity Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Humidity</CardTitle>
            <Droplets className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-4xl font-bold text-blue-400">
                {data?.humidity ? data.humidity.toFixed(1) : '--'}
              </div>
              <div className="text-slate-500 mb-1">%</div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Target: 50-80% RH</span>
              <Badge variant={getHumidityStatus()} className="text-[10px] px-1.5 py-0">
                {getHumidityStatus() === 'success' ? 'Optimal' : getHumidityStatus() === 'warning' ? 'Monitor' : 'Alert'}
              </Badge>
            </div>
            {data?.humidity && (
              <Progress
                value={data.humidity}
                className="mt-3 h-1"
              />
            )}
          </CardContent>
        </Card>

        {/* Uptime Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">System Uptime</CardTitle>
            <Clock className="h-5 w-5 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-4xl font-bold text-cyan-400">
                {data?.uptime ? Math.floor(data.uptime / 60) : '--'}
              </div>
              <div className="text-slate-500 mb-1">min</div>
            </div>
            <div className="text-xs text-slate-500">
              Last update: {data?.timestamp ? `${(data.timestamp / 1000).toFixed(0)}s ago` : 'Never'}
            </div>
          </CardContent>
        </Card>

        {/* System Stats Card */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Signal className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Signal</div>
                  <div className="text-sm font-semibold text-slate-200">{data?.rssi ? `${data.rssi} dBm` : '--'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <HardDrive className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Memory</div>
                  <div className="text-sm font-semibold text-slate-200">{data?.free_heap ? `${(data.free_heap / 1024).toFixed(0)} KB` : '--'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Cpu className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Heater</div>
                  <div className="text-sm font-semibold">
                    <Badge variant={data?.heater ? 'default' : 'secondary'} className="text-[10px]">
                      {data?.heater ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Cpu className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Status</div>
                  <div className="text-sm font-semibold">
                    <Badge variant={status === 'online' ? 'success' : 'destructive'} className="text-[10px]">
                      {status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
