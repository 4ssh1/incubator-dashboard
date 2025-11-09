import { NextRequest, NextResponse } from 'next/server';

interface ControlResponse {
  success: boolean;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ControlResponse>> {
  const command = await request.json() as Record<string, boolean | number | string>;
  console.log('Control command received:', command);

  // Command will be sent from client-side MQTT
  return NextResponse.json({
    success: true,
    message: 'Command will be sent via MQTT from client'
  });
}
