'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="mb-6 -ml-3"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Kembali
    </Button>
  )
}
