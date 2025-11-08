export async function POST(request) {
  const command = await request.json();
  console.log('Control command received:', command);
  
  // Command will be sent from client-side MQTT
  return Response.json({ 
    success: true, 
    message: 'Command will be sent via MQTT from client' 
  });
}