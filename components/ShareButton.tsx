'use client'

import { useEffect, useState } from "react"
import { Button } from "./ui/Button"
import { Share2 } from "lucide-react"

type ShareButtonProps = {
  title: string
}

const ShareButton = ({ title }: ShareButtonProps) => {

    const [currentUrl, setCurrentUrl] = useState("")

    useEffect(() => {
        if (typeof window !== "undefined") {
        setCurrentUrl(window.location.href)
        }
    }, [])

    const handleShare = () => {
        if (!currentUrl) return

        if (navigator.share) {
        navigator
            .share({
            title,
            text: "Baca cerita perjalanan ini di Travoo!",
            url: currentUrl,
            })
            .catch((err) => console.error("Gagal share:", err))
        } else {
        navigator.clipboard.writeText(currentUrl)
        alert("Link cerita telah disalin ke clipboard!")
        }
    }
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-gray-500 hover:text-green-600"
      onClick={handleShare}
    >
      <Share2 className="h-5 w-5" />
    </Button>
  )
}

export default ShareButton