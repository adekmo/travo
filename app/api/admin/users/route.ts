// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FilterQuery } from 'mongoose';
import User from '@/models/User';
import { User as IUser } from '@/types/user'; 

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Ambil query parameters
    const search = req.nextUrl.searchParams.get('search');
    const role = req.nextUrl.searchParams.get('role');
    const isVerified = req.nextUrl.searchParams.get('isVerified');

    // let query: any = {};
    const query: FilterQuery<IUser> = {};

    // Pencarian berdasarkan nama atau email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter berdasarkan role
    if (role) {
      query.role = role as IUser['role'];
    }

    if (isVerified !== null) {
      query.isVerified = isVerified === 'true';
    }

    const users = await User.find(query);

    return NextResponse.json(users);
  } catch (error) {
    console.error('Terdapat kesalahan', error);
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 });
  }
}
