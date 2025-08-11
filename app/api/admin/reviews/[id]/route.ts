import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const body = await req.json()
    const { id } = await params;
    const updated = await Review.findByIdAndUpdate(id, { hidden: body.hidden }, { new: true })

    if (!updated) {
      return NextResponse.json({ message: 'Review tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Berhasil diperbarui' })
  } catch (error) {
    console.error('Error saat update review:', error);
    return NextResponse.json({ message: 'Gagal update review' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params;
    const deleted = await Review.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ message: 'Review tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Review berhasil dihapus' })
  } catch (error) {
    console.error('DELETE /api/admin/reviews/:id error:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
