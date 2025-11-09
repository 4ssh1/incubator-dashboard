'use client';

import { useState, ChangeEvent } from 'react';
import { RotateCw, Gauge, Settings2 } from 'lucide-react';
import { SensorData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ServoControlsProps {
  data: SensorData | null;
  onCommand: (command: Record<string, boolean | number>) => void;
}

export default function ServoControls({ data, onCommand }: ServoControlsProps) {
  const [solarInlet, setSolarInlet] = useState<number>(0);
  const [topVent, setTopVent] = useState<number>(0);
  const [interval, setInterval] = useState<number>(5000);

  const handleServoChange = (servo: string, value: number[]): void => {
    const angleValue = value[0];
    if (servo === 'solar_inlet') {
      setSolarInlet(angleValue);
    } else {
      setTopVent(angleValue);
    }
    onCommand({ [servo]: angleValue });
  };

  const handleTurnEggs = (): void => {
    onCommand({ turn_eggs: true });
  };

  const handleIntervalUpdate = (): void => {
    const newInterval = interval;
    if (newInterval >= 1000 && newInterval <= 60000) {
      onCommand({ interval: newInterval });
    } else {
      alert('Interval must be between 1000 and 60000 milliseconds');
    }
  };

  return (
    <section className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Servo & Motion Control</h2>
        <p className="text-sm text-slate-400 mt-1">Adjust ventilation and egg rotation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Solar Inlet Flap */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Gauge className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Solar Inlet Flap</CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Temperature regulation vent</p>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-orange-400 border-orange-500/30">
                {data?.servo1_angle || solarInlet}°
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <Slider
                value={[data?.servo1_angle || solarInlet]}
                onValueChange={(value) => handleServoChange('solar_inlet', value)}
                max={180}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0° (Closed)</span>
                <span>90° (Half)</span>
                <span>180° (Open)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Vent */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Gauge className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Top Vent</CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Humidity control vent</p>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-blue-400 border-blue-500/30">
                {data?.servo2_angle || topVent}°
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <Slider
                value={[data?.servo2_angle || topVent]}
                onValueChange={(value) => handleServoChange('top_vent', value)}
                max={180}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0° (Closed)</span>
                <span>90° (Half)</span>
                <span>180° (Open)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stepper Motor Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <RotateCw className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-base">Egg Rotation System</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">NEMA17 stepper motor control</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Every 4h
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            onClick={handleTurnEggs}
            className="w-full h-12 text-base font-semibold gap-2"
            size="lg"
          >
            <RotateCw className="h-5 w-5" />
            Turn Eggs Now
          </Button>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-slate-400" />
              <label className="text-sm font-medium text-slate-300">
                Update Interval
              </label>
            </div>

            <div className="flex gap-3">
              <input
                type="number"
                value={interval}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInterval(parseInt(e.target.value))}
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="5000"
                min="1000"
                max="60000"
              />
              <Button
                onClick={handleIntervalUpdate}
                variant="outline"
                className="px-6"
              >
                Apply
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Range: 1000 - 60000 ms</span>
              <span>{(interval / 1000).toFixed(1)}s</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
