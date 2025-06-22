import { connectDB } from "@/lib/mongodb";
import TravelPackage from "@/models/TravelPackage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

import AdminNotification from "@/models/AdminNotification"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "seller") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const travelPackage = await TravelPackage.findOne({
    _id: params.id,
    seller: session.user.id,
  });

  if (!travelPackage) {
    return NextResponse.json({ message: "Not found or not yours" }, { status: 404 });
  }

  return NextResponse.json(travelPackage);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "seller") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const updated = await TravelPackage.findOneAndUpdate(
    { _id: params.id, seller: session.user.id },
    body,
    { new: true }
  );

  if (updated) {
    await AdminNotification.create({
      message: `Seller memperbarui paket: ${updated.title}`,
      type: 'updated_package',
      sellerId: session.user.id,
      packageId: updated._id,
    })
  }

  if (!updated) {
    return NextResponse.json({ message: "Not found or not yours" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "seller") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await TravelPackage.findOneAndDelete({ _id: params.id, seller: session.user.id });

  return NextResponse.json({ message: "Deleted successfully" });
}
