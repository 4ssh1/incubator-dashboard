'use client';

import { Power, Fan, Wind, Droplets, LucideIcon } from 'lucide-react';
import { SensorData } from '@/types';

interface ManualControlsProps {
  data: SensorData | null;
  onCommand: (command: Record<string, boolean>) => void;
}

interface Control {
  id: string;
  label: string;
  icon: LucideIcon;
  activeColor: string;
  onLabel: string;
  offLabel: string;
}

export default function ManualControls({ data, onCommand }: ManualControlsProps) {
  const handleToggle = (device: string): void => {
    const currentState = data?.[device as keyof SensorData] as boolean | undefined;
    const command = { [device]: !currentState };
    onCommand(command);
  };

  const controls: Control[] = [
    { id: 'heater', label: 'Heater', icon: Power, activeColor: 'text-orange-400', onLabel: 'ON', offLabel: 'OFF' },
    { id: 'internal_fan', label: 'Int. Fan', icon: Fan, activeColor: 'text-blue-400', onLabel: 'ON', offLabel: 'OFF' },
    { id: 'solar_fans', label: 'Solar Fans', icon: Wind, activeColor: 'text-yellow-400', onLabel: 'ON', offLabel: 'OFF' },
    { id: 'solenoid', label: 'Solenoid', icon: Droplets, activeColor: 'text-cyan-400', onLabel: 'OPEN', offLabel: 'CLOSED' }
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-slate-100">Controls</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {controls.map((ctrl) => {
          const Icon = ctrl.icon;
          const isActive = data?.[ctrl.id as keyof SensorData] as boolean | undefined;
          return (
            <button
              key={ctrl.id}
              onClick={() => handleToggle(ctrl.id)}
              className={`p-4 rounded-lg transition-all border ${
                isActive
                  ? `bg-slate-700 border-slate-600 ${ctrl.activeColor}`
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <Icon size={32} className="mb-2" />
              <p className="text-sm font-semibold">{ctrl.label}</p>
              <p className={`text-xs mt-1 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                {isActive ? ctrl.onLabel : ctrl.offLabel}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
