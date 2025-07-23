import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const user = await User.findById(token.id).select("name phone address avatar bio");

    return NextResponse.json(user);

  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, phone, address, avatar, bio } = await req.json();

  try {
    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      token.id,
      { name, phone, address, avatar, bio },
      { new: true }
    );

    return NextResponse.json({ message: "Profil berhasil diperbarui", user: updatedUser });
  } catch (error) {
    console.error("Gagal update profil:", error);
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
}
