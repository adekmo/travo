import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import TravelPackage from "@/models/TravelPackage";
import Category from "@/models/Category"
import User from "@/models/User";
import ActivityLog from "@/models/ActivityLog";

export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "seller") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const packages = await TravelPackage.find({ seller: session.user.id })
        .populate('category', 'name')
        
  return NextResponse.json(packages);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "seller") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id);
    if (!user || !user.isVerified) {
      return NextResponse.json({ message: "Seller belum diverifikasi" }, { status: 403 });
    }

    // const { category, ...bodyWithoutCategory } = await req.json();
    const {
      title, description, price, location, image,
      duration, maxPeople,
      highlights, facilities,
      included, excluded, itinerary,
      category
    } = await req.json();

    if (category) { // Hanya validasi jika 'category' diberikan
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return NextResponse.json({ message: "Kategori tidak ditemukan" }, { status: 400 });
      }
    }

    const newPackage = await TravelPackage.create({
      title,
      description,
      price,
      location,
      image,
      duration,
      maxPeople,
      highlights,
      facilities,
      included,
      excluded,
      itinerary,
      seller: session.user.id,
      category: category || null,
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
  } catch (error: any) {
    console.error("Error creating package details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json({ message: 'Terjadi kesalahan pada server saat menambahkan paket. Mohon coba lagi nanti.' }, { status: 500 });
  }
}
