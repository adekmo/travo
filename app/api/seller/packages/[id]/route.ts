import { connectDB } from "@/lib/mongodb";
import TravelPackage from "@/models/TravelPackage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import AdminNotification from "@/models/AdminNotification"
import ActivityLog from "@/models/ActivityLog";
import Category from "@/models/Category";
import { TravelPackage as TravelPackageType } from "@/types/travelPackage";

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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "seller") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { category, ...updateData } = body;

    // ✅ Perbaikan: gunakan Partial<TravelPackageType> agar typescript aman
    const updateFields: Partial<TravelPackageType> = { ...updateData };

    // ✅ Perbaikan: periksa jika category dikirim, bisa null atau id string
    if (category !== undefined) {
      if (category === null) {
        // Jika null, artinya ingin menghapus kategori
        updateFields.category = undefined; // ✅ Perbaikan: gunakan `undefined` karena tipe tidak menerima `null`
      } else {
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
          return NextResponse.json({ message: "Kategori tidak ditemukan atau tidak valid." }, { status: 400 });
        }
        updateFields.category = {
          _id: existingCategory._id.toString(),
          name: existingCategory.name
        }; // ✅ Perbaikan: pastikan bentuknya sesuai dengan tipe TravelPackageType
      }
    }

    // ✅ Validasi data tambahan
    if (updateData.title && updateData.title.trim() === '') {
      return NextResponse.json({ message: "Judul paket tidak boleh kosong." }, { status: 400 });
    }

    if (
      updateData.price &&
      (isNaN(parseFloat(updateData.price)) || parseFloat(updateData.price) <= 0)
    ) {
      return NextResponse.json({ message: "Harga paket harus angka positif." }, { status: 400 });
    }

    if (
      updateData.location === undefined ||
      updateData.location === null ||
      updateData.location.trim() === ''
    ) {
      return NextResponse.json({ message: "Lokasi paket wajib diisi." }, { status: 400 });
    }

    // ✅ Update data di database
    const updated = await TravelPackage.findOneAndUpdate(
      { _id: params.id, seller: session.user.id },
      updateFields,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Paket tidak ditemukan atau Anda tidak memiliki izin untuk mengeditnya." },
        { status: 404 }
      );
    }

    // ✅ Kirim notifikasi ke admin jika berhasil update
    await AdminNotification.create({
      message: `Seller memperbarui paket: ${updated.title}`,
      type: "updated_package",
      sellerId: session.user.id,
      packageId: updated._id,
    });

    // ✅ Tambahkan ke activity log
    await ActivityLog.create({
      seller: session.user.id,
      action: "update-package",
      packageId: updated._id,
      message: `Mengubah paket: ${updated.title}`,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("terjadi kesalahan", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server, coba beberapa saat lagi" },
      { status: 500 }
    );
  }
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

  const existingPackage = await TravelPackage.findOne({
    _id: params.id,
    seller: session.user.id,
  });

  if (!existingPackage) {
    return NextResponse.json({ message: "Not found or not yours" }, { status: 404 });
  }

  await TravelPackage.findOneAndDelete({ _id: params.id, seller: session.user.id });

  await ActivityLog.create({
    seller: session.user.id,
    action: "delete-package",
    packageId: existingPackage._id,
    message: `Menghapus paket: ${existingPackage.title}`,
  });

  return NextResponse.json({ message: "Deleted successfully" });
}
