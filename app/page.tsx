import { Suspense } from 'react'
import Hero from '@/components/Hero'
import FeaturedStory from '@/components/FeaturedStory'
import Features from '@/components/Features'
import Footer from '@/components/Footer'
// import dynamic from 'next/dynamic'
import PackagesContent from '@/components/PakcagesContent'

// Dynamically import the client component (optional — ensures it's client-only)
// const PackagesContent = dynamic(() => import('@/components/PackagesContent'), {
//   ssr: false,
// })

export default function PackagesPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <Hero />
      <Suspense fallback={<div>Memuat data...</div>}>
        <PackagesContent />
      </Suspense>
      <FeaturedStory />
      <Features />
      <Footer />
    </div>
  )
}
