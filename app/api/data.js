import { db } from '@/firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request) {
  try {
    const data = await request.json();
    
    const docRef = await addDoc(collection(db, 'sensor_readings'), {
      ...data,
      savedAt: serverTimestamp()
    });
    
    return Response.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}