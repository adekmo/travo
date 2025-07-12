'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TravelPackage } from '@/types/travelPackage'
import PackagesReviewList from '@/components/PackagesReviewList'
import Link from 'next/link'
import { Award, Calendar, CheckCircle, Clock, Gift, Heart, MapPin, Shield, Star, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'

type Params = { id: string }

const DetailPackagesPage = ({ params }: { params: Promise<Params> }) => {
    const { id } = use(params)
    const [packageData, setPackageData] = useState<TravelPackage | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("overview");
    const router = useRouter()

    useEffect(() => {
        const fetchPackage = async () => {
        const res = await fetch(`/api/packages/${id}`)
        if (res.ok) {
            const data = await res.json()
            setPackageData(data)
        } else {
            alert('Paket tidak ditemukan')
        }
        setLoading(false)
        }

        fetchPackage()
    }, [id])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!packageData) {
        return <div>Paket tidak ditemukan</div>
    }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      className={`bg-gradient-to-r from-blue-500 to-cyan-500 text-white`}
                    >
                      🏖️ {packageData.category?.name}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {packageData.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium">
                        {packageData.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {packageData.averageRating?.toString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* WishList */}
                {/* <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={
                      isWishlisted
                        ? "bg-red-50 border-red-200 text-red-600"
                        : ""
                    }
                  >
                    <Heart
                      className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div> */}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                <Image
                  src={packageData.image || '/placeholder.jpg'}
                  alt={packageData.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>

            {/* Tabs Content */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Deskripsi Paket</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {packageData.description}
                    </p>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">
                        Highlights Perjalanan:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* {packageData.highlights.map((highlight, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-gray-700"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))} */}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Facilities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Fasilitas & Layanan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* {packageData.facilities.map((facility, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg"
                        >
                          <span className="text-2xl">{facility.icon}</span>
                          <span className="text-sm font-medium text-center">
                            {facility.name}
                          </span>
                        </div>
                      ))} */}
                    </div>
                  </CardContent>
                </Card>

                {/* Included/Excluded */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-700">
                        ✅ Termasuk dalam Paket
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {/* {packageData.included.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))} */}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-700">
                        ❌ Tidak Termasuk
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {/* {packageData.excluded.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <span className="text-red-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))} */}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="itinerary" className="space-y-4">
                {/* {packageData.itinerary.map((day, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {day.day}
                        </div>
                        <span>
                          Hari {day.day}: {day.title}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-semibold mb-2">Aktivitas:</h5>
                          <ul className="space-y-1">
                            {day.activities.map((activity, actIndex) => (
                              <li
                                key={actIndex}
                                className="flex items-start gap-2 text-sm"
                              >
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                          <div>
                            <span className="text-sm font-semibold text-gray-600">
                              Meals:{" "}
                            </span>
                            <span className="text-sm">{day.meals}</span>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-600">
                              Akomodasi:{" "}
                            </span>
                            <span className="text-sm">{day.accommodation}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))} */}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                {/* Individual Reviews */}
                <div className="space-y-4">
                  <PackagesReviewList packageId={packageData._id ?? ''} />
                </div>
              </TabsContent>

              <TabsContent value="policies" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>🔄 Kebijakan Pembatalan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        {/* {packageData.policies.cancellation} */}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>💳 Kebijakan Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        {/* {packageData.policies.payment} */}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>👥 Kebijakan Grup</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        {/* {packageData.policies.group} */}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>👶 Kebijakan Usia</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        {/* {packageData.policies.age} */}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Price Card */}
              <Card className="border-2 border-blue-100">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {packageData.price}
                      </div>
                      <div className="text-sm text-gray-500">per orang</div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          Durasi
                        </span>
                        <span className="font-medium">
                          {/* {packageData.duration} */}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          Maks. Peserta
                        </span>
                        <span className="font-medium">
                          {/* {packageData.maxPeople} orang */}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          Tersedia
                        </span>
                        <span className="font-medium text-green-600">
                          Hari ini
                        </span>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="lg"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => router.push(`/packages/${id}/booking`)}
                        >
                          🎯 Pesan Paket Sekarang
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Pesan Paket: {packageData.title}
                          </DialogTitle>
                        </DialogHeader>
                        {/* <BookingForm packageData={packageData} /> */}
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="lg" className="w-full">
                      <Link href={`/dashboard/customer/chat/${packageData.seller._id}`}>
                      💬 Chat dengan Seller
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Tentang Seller</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3 mb-4">
                    <Image
                      src={packageData.image || ''}
                      alt={packageData.seller.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        {packageData.seller.name}
                      </h4>
                    </div>
                    <div>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <div className="font-medium">100% Aman</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Zap className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <div className="font-medium">Instant Booking</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Gift className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                      <div className="font-medium">Free Gift</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Award className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                      <div className="font-medium">Best Price</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* <h1 className="text-3xl font-bold mb-4">{packageData.title}</h1> */}
      {/* <img src={packageData.image} alt={packageData.title} className="w-full h-80 object-cover mb-6" />
      <p className="text-lg mb-6">{packageData.description}</p>
      <div className="mb-6">
        <strong>Harga: </strong> Rp {packageData.price}
      </div>
      <div className="mb-6">
        <strong>Lokasi: </strong> {packageData.location}
      </div>
      <div className="mb-6">
        <strong>Seller: </strong> {packageData.seller?.name}
      </div> */}
      {/* <div className="mb-6">
        <strong>Tanggal: </strong> {new Date(packageData.date).toLocaleDateString()}
      </div> */}
      {/* <PackagesReviewList packageId={packageData._id ?? ''} />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => router.push(`/packages/${id}/booking`)}
      >
        Pesan Paket
      </button>
      <Link
        href={`/dashboard/customer/chat/${packageData.seller._id}`}
        className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mx-2"
      >
        💬 Chat Seller
      </Link> */}
    </div>
  )
}

export default DetailPackagesPage