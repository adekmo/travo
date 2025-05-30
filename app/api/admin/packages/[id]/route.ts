import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import TravelPackage from '@/models/TravelPackage';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await TravelPackage.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Paket berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus paket' }, { status: 500 });
  }
}
