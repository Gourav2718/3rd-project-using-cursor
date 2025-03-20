import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Fort from '@/models/Fort';

// Get all forts
async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all forts, sorted by name
    const forts = await Fort.find({}).sort({ name: 1 });

    return NextResponse.json(forts);
  } catch (error: any) {
    console.error('Error fetching forts:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching forts' },
      { status: 500 }
    );
  }
}

// Expose the GET endpoint without protection for development
export { GET }; 