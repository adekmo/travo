import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import TravelPackage from '@/models/TravelPackage';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if(!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized'}, { status: 401});
    }

    const deleteDocument = await TravelPackage.findByIdAndDelete(params.id);

    if(!deleteDocument){
      return NextResponse.json({ message: 'Document Not Found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error("Delete operation error", error);
    return NextResponse.json({ message: 'Internal Server Error'}, { status: 500 });
  }
}
