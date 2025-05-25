import { connectDB } from "@/lib/mongodb";
import TravelPackage from "@/models/TravelPackage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

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

  const body = await req.json();
  const newPackage = await TravelPackage.create({
    ...body,
    seller: session.user.id,
  });

  return NextResponse.json(newPackage, { status: 201 });
}
