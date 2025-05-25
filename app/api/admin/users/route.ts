// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Ambil query parameters
    const search = req.nextUrl.searchParams.get('search');
    const role = req.nextUrl.searchParams.get('role');
    const isVerified = req.nextUrl.searchParams.get('isVerified');

    let query: any = {};

    // Pencarian berdasarkan nama atau email
    if (search) {
      query = { ...query, $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] };
    }

    // Filter berdasarkan role
    if (role) {
      query = { ...query, role };
    }

    // Filter berdasarkan status verifikasi
    if (isVerified !== null) {
      query = { ...query, isVerified: isVerified === 'true' };
    }

    // Ambil data user dari MongoDB
    const users = await User.find(query);

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 });
  }
}
