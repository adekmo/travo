import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import clientPromise from "@/lib/mongodb-client";
import User from "@/models/User";
import mongoose from "mongoose";

import AdminNotification from "@/models/AdminNotification"
import ActivityLog from "@/models/ActivityLog";


export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Semua field wajib diisi" }, { status: 400 });
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email sudah digunakan" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
    });

    // console.log(newUser);
    await newUser.save();

    if (newUser.role === 'seller') {
      await AdminNotification.create({
        message: `Seller baru mendaftar: ${newUser.name}`,
        type: 'new_seller',
        sellerId: newUser._id,
      })
    }

    if (newUser.role === 'seller'){
      await ActivityLog.create({
        seller: newUser._id,
        action: 'register',
        message: `${newUser.name} mendaftar sebagai seller`
      })
    }

    return NextResponse.json({ message: "Pendaftaran berhasil" }, { status: 201 });

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
