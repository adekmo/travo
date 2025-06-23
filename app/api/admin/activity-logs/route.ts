import { connectDB } from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();

  const logs = await ActivityLog.find({})
    .populate('seller', 'name email')
    .populate('packageId', 'title')
    .sort({ createdAt: -1 });

  return NextResponse.json(logs);
}
