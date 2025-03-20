import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Find admin by email
    const admin = await Admin.findOne({ email }).select('+password');

    // Check if admin exists and password matches
    if (!admin || !(await admin.matchPassword(password))) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token with admin flag
    const token = signToken(admin._id.toString(), true);

    // Create response
    const response = NextResponse.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      isAdmin: true,
      token,
    });

    // Set token in HTTP-only cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error('Error in admin login:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during login' },
      { status: 500 }
    );
  }
} 