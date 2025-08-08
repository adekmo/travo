import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { Types } from "mongoose";
// import TravelPackage from '@/models/TravelPackage'
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'customer') {
    //   console.log('Unauthorized access or not customer:', session?.user?.email)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await User.findOne({ email: session.user.email }).populate({
      path: 'wishlist',
      select: '_id title image location price category',
    })

    if (!user) {
    //   console.log('User not found for email:', session.user.email)
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    console.log('Wishlist for user:', user.email, user.wishlist)

    return NextResponse.json(user.wishlist || [])
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}

export async function POST(req: NextRequest){
    try {
        await connectDB()
        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== 'customer'){
            return NextResponse.json({ message: 'Unauthorized'}, { status: 401 })
        }

        const { packageId } = await req.json()

        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        const alreadyInWishlist = user.wishlist.includes(packageId)

        if (alreadyInWishlist) {
            user.wishlist = user.wishlist.filter((id: Types.ObjectId) => id.toString() !== packageId)
        } else {
            user.wishlist.push(packageId)
        }

        await user.save()

        return NextResponse.json({
            message: alreadyInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
    }
}