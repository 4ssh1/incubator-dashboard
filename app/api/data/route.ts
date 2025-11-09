import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase.config';
import { collection, addDoc, serverTimestamp, DocumentReference } from 'firebase/firestore';
import { SensorData } from '@/types';

interface SaveResponse {
  success: boolean;
  id?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SaveResponse>> {
  try {
    const data = await request.json() as SensorData;

    const docRef: DocumentReference = await addDoc(collection(db, 'sensor_readings'), {
      ...data,
      savedAt: serverTimestamp()
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
