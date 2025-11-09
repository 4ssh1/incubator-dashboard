'use client';

import { Power, Fan, Wind, Droplets } from 'lucide-react';
import { SensorData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface ManualControlsProps {
  data: SensorData | null;
  onCommand: (command: Record<string, boolean>) => void;
}

interface Control {
  id: string;
  label: string;
  icon: React.ComponentType<{className?: string}>;
  activeColor: string;
  description: string;
}

export default function ManualControls({ data, onCommand }: ManualControlsProps) {
  const handleToggle = (device: string): void => {
    const currentState = data?.[device as keyof SensorData] as boolean | undefined;
    const command = { [device]: !currentState };
    onCommand(command);
  };

  const controls: Control[] = [
    { id: 'heater', label: 'Heater', icon: Power, activeColor: 'text-orange-400', description: 'PID temperature control' },
    { id: 'internal_fan', label: 'Internal Fan', icon: Fan, activeColor: 'text-blue-400', description: 'Air circulation' },
    { id: 'solar_fans', label: 'Solar Fans', icon: Wind, activeColor: 'text-yellow-400', description: 'External ventilation' },
    { id: 'solenoid', label: 'Solenoid Valve', icon: Droplets, activeColor: 'text-cyan-400', description: 'Water release' }
  ];

  return (
    <section className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Device Controls</h2>
        <p className="text-sm text-slate-400 mt-1">Manually override automated systems</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {controls.map((ctrl) => {
          const Icon = ctrl.icon;
          const isActive = data?.[ctrl.id as keyof SensorData] as boolean | undefined;

          return (
            <Card key={ctrl.id} className="relative overflow-hidden group hover:shadow-lg transition-all">
              <div className={`absolute top-0 right-0 w-24 h-24 ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity ${
                ctrl.id === 'heater' ? 'bg-orange-500/10' :
                ctrl.id === 'internal_fan' ? 'bg-blue-500/10' :
                ctrl.id === 'solar_fans' ? 'bg-yellow-500/10' :
                'bg-cyan-500/10'
              } rounded-full blur-3xl`}></div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg ${
                    ctrl.id === 'heater' ? 'bg-orange-500/10 border border-orange-500/20' :
                    ctrl.id === 'internal_fan' ? 'bg-blue-500/10 border border-blue-500/20' :
                    ctrl.id === 'solar_fans' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                    'bg-cyan-500/10 border border-cyan-500/20'
                  }`}>
                    <Icon className={`h-5 w-5 ${isActive ? ctrl.activeColor : 'text-slate-500'}`} />
                  </div>
                  <Switch
                    checked={isActive || false}
                    onCheckedChange={() => handleToggle(ctrl.id)}
                  />
                </div>
              </CardHeader>

              <CardContent>
                <CardTitle className="text-base mb-1 text-slate-100">{ctrl.label}</CardTitle>
                <p className="text-xs text-slate-500 mb-3">{ctrl.description}</p>

                <div className="flex items-center justify-between">
                  <Badge
                    variant={isActive ? 'default' : 'secondary'}
                    className="text-[10px] px-2"
                  >
                    {isActive ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                  {isActive && (
                    <div className={`w-2 h-2 rounded-full ${ctrl.activeColor.replace('text-', 'bg-')} animate-pulse`}></div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
