import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // <--- penting: Promise<{ id: string }>
) {
  try {
    await connectDB();

    // params is a Promise in Next.js 15+, so await it
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Missing booking id' },
        { status: 400 }
      );
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    await Booking.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Booking deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
