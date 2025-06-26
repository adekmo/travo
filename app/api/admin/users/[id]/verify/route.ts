// app/api/admin/users/[id]/verify/route.ts
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const userId = params.id;

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });

    user.isVerified = true;
    await user.save();
    console.log("User berhasil diverifikasi");

    return NextResponse.json({ message: "User berhasil diverifikasi" });
  } catch (error) {
    console.error("Gagal verifikasi user:", error);
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
}
