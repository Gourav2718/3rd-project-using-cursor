import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Fort from '@/models/Fort';

// Get all forts
export async function GET() {
  try {
    console.log('API: Starting GET /api/forts request');
    await connectDB();
    console.log('API: Database connected');
    
    const forts = await Fort.find({}).sort({ name: 1 });
    console.log(`API: Found ${forts.length} forts`);
    
    return NextResponse.json(forts, { status: 200 });
  } catch (error: unknown) {
    console.error('API ERROR: GET /api/forts failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch forts', details: errorMessage },
      { status: 500 }
    );
  }
} 