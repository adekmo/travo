import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const categories = await Category.find().sort({ name: 1 })
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Gagal mengambil data Kategori', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if(!session || session.user.role !== 'admin'){
            return NextResponse.json({ message: 'Unauthorized'}, { status: 401 })
        }

        const { name, description } = await req.json();
        if (!name) {
            return NextResponse.json({ message: "Nama kategori wajib diisi" }, { status: 400 });
        }

        const existing = await Category.findOne({ name });
        if(existing){
            return NextResponse.json({ message: "Kategori sudah ada" }, { status: 400 });
        }

        const newCategory = new Category({ name, description });
        await newCategory.save();

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error('Gagal mengirim data Kategori', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}