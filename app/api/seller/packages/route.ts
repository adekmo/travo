import { connectDB } from "@/lib/mongodb";
import TravelPackage from "@/models/TravelPackage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import ActivityLog from "@/models/ActivityLog";

export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "seller") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const packages = await TravelPackage.find({ seller: session.user.id });
  return NextResponse.json(packages);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "seller") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Cek verifikasi seller
  const user = await User.findById(session.user.id);

  if (!user || !user.isVerified) {
    return NextResponse.json({ message: "Seller belum diverifikasi" }, { status: 403 });
  }

  const body = await req.json();
  const newPackage = await TravelPackage.create({
    ...body,
    seller: session.user.id,
  });

  if(newPackage) {
    await ActivityLog.create({
      seller: session.user.id,
      action: 'add-package',
      packageId: newPackage._id,
      message: `Menambahkan paket: ${newPackage.title}`
    });
  }

  return NextResponse.json(newPackage, { status: 201 });
}
