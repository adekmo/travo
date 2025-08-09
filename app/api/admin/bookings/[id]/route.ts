import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';

// Handler DELETE untuk menghapus booking berdasarkan ID
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = context.params;

    // Cek apakah booking ada
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    // Hapus booking
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
