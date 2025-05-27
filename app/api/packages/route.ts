import { connectDB } from '@/lib/mongodb'
import TravelPackage from '@/models/TravelPackage'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  await connectDB()

  const { searchParams } = new URL(req.url)

  const search = searchParams.get('search') || ''
  const location = searchParams.get('location') || ''
  const minPrice = Number(searchParams.get('minPrice')) || 0
  const maxPrice = Number(searchParams.get('maxPrice')) || 10000000
  const sort = searchParams.get('sort') || ''

  const query: any = {
      title: { $regex: search, $options: 'i' },
      location: { $regex: location, $options: 'i' },
      price: { $gte: minPrice, $lte: maxPrice },
  }

  let sortQuery = {}
  if (sort === 'price_asc') sortQuery = { price: 1 }
  else if (sort === 'price_desc') sortQuery = { price: -1 }
  else if (sort === 'newest') sortQuery = { createdAt: -1 }

  const packages = await TravelPackage.find(query).sort(sortQuery)

  return NextResponse.json(packages)
}
