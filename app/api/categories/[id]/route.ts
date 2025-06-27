import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await req.json();

    if (name === undefined || name === null || name.trim() === '') {
        return NextResponse.json({ message: "Nama kategori tidak boleh kosong" }, { status: 400 });
    }

    if (name) { // Hanya cek duplikasi jika nama diberikan
        const existingWithSameName = await Category.findOne({ name, _id: { $ne: params.id } });
        if (existingWithSameName) {
            return NextResponse.json({ message: "Nama kategori sudah ada untuk kategori lain" }, { status: 400 });
        }
    }

    const updated = await Category.findByIdAndUpdate(
        params.id,
        { name, description },
        { new: true }
    );

    if (!updated) {
        return NextResponse.json({ message: "Kategori tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
        console.error('Gagal mengupdate data Kategori', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const deleted = await Category.findByIdAndDelete(params.id);

    if (!deleted) {
        return NextResponse.json({ message: "Kategori tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
        console.error('Gagal menghapus data Kategori', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
