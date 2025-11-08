export const dynamic = 'force-dynamic';

// In-memory storage (will be replaced by real MQTT data from client-side)
let sensorDataStore = {
  status: 'offline',
  data: null
};

export async function GET() {
  return Response.json(sensorDataStore);
}

export async function POST(request) {
  const body = await request.json();
  sensorDataStore = body;
  return Response.json({ success: true });
}