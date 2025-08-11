// app/api/packages/[id]/route.ts
import { connectDB } from "@/lib/mongodb";
import TravelPackage from "@/models/TravelPackage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const { id } = await params;
    const travelPackage = await TravelPackage.findById(id)
      .populate('seller', 'name')
      .populate('category', 'name');

    if (!travelPackage) {
      return NextResponse.json({ message: "Paket tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(travelPackage);
  } catch (error) {
    console.error('terdapat kesalahan', error);
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
}
