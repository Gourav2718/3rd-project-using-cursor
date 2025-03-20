import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Fort from '@/models/Fort';
import { verifyToken } from '@/lib/auth';

interface JwtPayload {
  userId: string;
  isAdmin: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const fort = await Fort.findById(params.id);
    
    if (!fort) {
      return NextResponse.json({ error: 'Fort not found' }, { status: 404 });
    }
    
    return NextResponse.json(fort);
  } catch (error) {
    console.error('Error fetching fort:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fort' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Remove _id from body to avoid MongoDB error
    const { _id, ...updateData } = body;
    
    const updatedFort = await Fort.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedFort) {
      return NextResponse.json({ error: 'Fort not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedFort);
  } catch (error) {
    console.error('Error updating fort:', error);
    return NextResponse.json(
      { error: 'Failed to update fort' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const fort = await Fort.findByIdAndDelete(params.id);

    if (!fort) {
      return NextResponse.json(
        { error: 'Fort not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Fort deleted successfully' });
  } catch (error) {
    console.error('Error deleting fort:', error);
    return NextResponse.json(
      { error: 'Failed to delete fort' },
      { status: 500 }
    );
  }
} 