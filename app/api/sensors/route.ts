import { NextRequest, NextResponse } from 'next/server';
import { SensorData } from '@/types';

export const dynamic = 'force-dynamic';

interface SensorDataStore {
  status: 'online' | 'offline';
  data: SensorData | null;
}

// In-memory storage (will be replaced by real MQTT data from client-side)
let sensorDataStore: SensorDataStore = {
  status: 'offline',
  data: null
};

export async function GET(): Promise<NextResponse<SensorDataStore>> {
  return NextResponse.json(sensorDataStore);
}

export async function POST(request: NextRequest): Promise<NextResponse<{ success: boolean }>> {
  const body = await request.json() as SensorDataStore;
  sensorDataStore = body;
  return NextResponse.json({ success: true });
}
