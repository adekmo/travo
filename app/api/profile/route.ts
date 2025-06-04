import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, phone, address } = await req.json();

  try {
    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      token.id,
      { name, phone, address },
      { new: true }
    );

    return NextResponse.json({ message: "Profil berhasil diperbarui", user: updatedUser });
  } catch (error) {
    console.error("Gagal update profil:", error);
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
}
