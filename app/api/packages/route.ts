// app/api/packages/route.ts
import { connectDB } from '@/lib/mongodb'
import TravelPackage from '@/models/TravelPackage'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectDB()
  const packages = await TravelPackage.find().sort({ createdAt: -1 })
  return NextResponse.json(packages)
}
