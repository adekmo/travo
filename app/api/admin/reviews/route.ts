import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const reviews = await Review.find()
      .populate('customer', 'name email')
      .populate('package', 'title location')
      .sort({ createdAt: -1 });

    return NextResponse.json({reviews});
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
