import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Fort from '@/models/Fort';
import { verifyToken } from '@/lib/auth';

interface JwtPayload {
  userId: string;
  isAdmin: boolean;
}

// Get all forts
export async function GET(request: NextRequest) {
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

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token) as JwtPayload;
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    
    // Remove temp id if exists
    const { _id, ...fortData } = body;
    
    const newFort = new Fort(fortData);
    await newFort.save();
    
    return NextResponse.json(newFort, { status: 201 });
  } catch (error) {
    console.error('Error creating fort:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 