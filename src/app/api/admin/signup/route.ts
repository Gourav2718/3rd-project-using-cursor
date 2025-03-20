import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 400 }
      );
    }

    // Create new admin
    const admin = await Admin.create({
      name,
      email,
      password,
    });

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
    console.error('Error in admin signup:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during signup' },
      { status: 500 }
    );
  }
} 