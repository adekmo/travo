import { Suspense } from 'react'
import Hero from '@/components/Hero'
import FeaturedStory from '@/components/FeaturedStory'
import Features from '@/components/Features'
import Footer from '@/components/Footer'
// import dynamic from 'next/dynamic'
import PackagesContent from '@/components/PakcagesContent'

export const metadata = {
  title: "Daftar Paket Wisata | Travoo",
  description: "Jelajahi ratusan paket wisata terbaik dari agen terpercaya.",
}

export default function Page() {
  return <div className="max-w-6xl mx-auto p-6">
      <Hero />
      <Suspense fallback={<div>Memuat data...</div>}>
        <PackagesContent />
      </Suspense>
      <FeaturedStory />
      <Features />
      <Footer />
    </div>
}
