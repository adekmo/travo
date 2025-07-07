import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'
import TravelPackage from '@/models/TravelPackage'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)

    const search = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''
    const minPrice = Number(searchParams.get('minPrice')) || 0
    const maxPrice = Number(searchParams.get('maxPrice')) || 10000000
    const sort = searchParams.get('sort') || ''
    const category = searchParams.get("category");

    const query: any = {
        title: { $regex: search, $options: 'i' },
        location: { $regex: location, $options: 'i' },
        price: { $gte: minPrice, $lte: maxPrice },
    }

    if (category) {
    query.category = category;
  }

    let sortQuery = {}
    if (sort === 'price_asc') sortQuery = { price: 1 }
    else if (sort === 'price_desc') sortQuery = { price: -1 }
    else if (sort === 'newest') sortQuery = { createdAt: -1 }

    const packages = await TravelPackage.find(query)
          .populate('category', 'name')
          .sort(sortQuery)
          .lean()
    
    const packagesWithRating = await Promise.all(
      packages.map(async (pkg) => {
        const reviews = await Review.find({ package: pkg._id })
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
        const averageRating = reviews.length ? totalRating / reviews.length : 0
        return {
          ...pkg,
          averageRating: Number(averageRating.toFixed(1)),
        }
      })
    )

    return NextResponse.json(packagesWithRating)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Internal Server Error, silahkan coba beberapa saat lagi"}, { status: 500 })
  }
}
