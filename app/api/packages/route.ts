import { connectDB } from '@/lib/mongodb'
import TravelPackage from '@/models/TravelPackage'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  await connectDB()

  const { searchParams } = new URL(req.url)

  const search = searchParams.get('search') || ''
  const location = searchParams.get('location') || ''
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  const query: any = {}

  if (search) {
    query.title = { $regex: search, $options: 'i' }
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' }
  }

  if (minPrice || maxPrice) {
    query.price = {}
    if (minPrice) query.price.$gte = Number(minPrice)
    if (maxPrice) query.price.$lte = Number(maxPrice)
  }

  const packages = await TravelPackage.find(query).sort({ createdAt: -1 })

  return NextResponse.json(packages)
}
