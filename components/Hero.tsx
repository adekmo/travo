import { Shield, Users } from "lucide-react"
import { Button } from "./ui/Button"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "./ui/Card"
import { Badge } from "./ui/Badge"

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-background dark:to-blue-950" />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-green-200/25 rounded-full blur-xl animate-pulse delay-500" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              {/* Badge dengan efek glow */}
              <div className="inline-flex">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Platform Travel Marketplace #1 di Indonesia
                </Badge>
              </div>

              {/* Heading dengan gradient text */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200">
                    Temukan Petualangan
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Tak Terlupakan
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
                  Jelajahi destinasi eksotis Indonesia dengan paket wisata
                  terlengkap.
                  <span className="mx-1 font-semibold text-blue-600 dark:text-blue-400">
                     Booking mudah, harga terjangkau,
                  </span>
                  dan pelayanan terbaik dari agen travel terpercaya.
                </p>
              </div>

              {/* CTA Buttons dengan animasi */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  asChild
                >
                  <Link href="/packages">Mulai Jelajahi</Link>
                </Button>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center group">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    50K+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Wisatawan Bahagia
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    200+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Destinasi Eksotis
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    4.9⭐
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Rating Pengguna
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Enhanced Hero Visual */}
            <div className="relative lg:ml-8">
              {/* Main Image Container */}
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-700 bg-gradient-to-br from-blue-100 to-purple-100">
                  <Image
                    src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&h=500&fit=crop"
                    alt="Beautiful Indonesian destination"
                    width={700}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Floating Achievement Cards */}
                <Card className="absolute -top-6 -right-6 p-4 bg-white/95 backdrop-blur-sm shadow-xl border-0 transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-0 flex items-center gap-3">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 p-3 rounded-full">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">
                        100% Aman
                      </div>
                      <div className="text-xs text-gray-600">
                        Terjamin & Terpercaya
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="absolute -bottom-8 -left-8 p-4 bg-white/95 backdrop-blur-sm shadow-xl border-0 transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-0 flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-600 p-3 rounded-full">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">
                        24/7 Support
                      </div>
                      <div className="text-xs text-gray-600">Siap Membantu</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Decorative Elements */}
                <div className="absolute -z-10 top-4 left-4 w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 rounded-3xl blur-xl opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Hero