import { connectDB } from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  const filter: any = {};

  if (start && end) {
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    filter.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };
  } else {
    // Default: hanya aktivitas hari ini
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    filter.createdAt = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  const logs = await ActivityLog.find(filter)
    .populate('seller', 'name email')
    .populate('packageId', 'title')
    .sort({ createdAt: -1 });

  return NextResponse.json(logs);
}
