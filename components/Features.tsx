import { Clock, Shield, TrendingUp } from 'lucide-react'
import React from 'react'
import { Card, CardContent } from './ui/Card'

const Features = () => {
  return (
    <div className='mt-10'>
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
          ✨ Keunggulan Kami
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent dark:from-white dark:to-green-200">
            Mengapa Memilih
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Travoo?
          </span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Kami berkomitmen memberikan pengalaman wisata terbaik dengan
          layanan profesional, teknologi modern, dan kepercayaan yang telah
          dibangun selama bertahun-tahun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Feature Card 1 */}
            <Card className="group relative overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative z-10">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Harga Terbaik
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Dapatkan harga terbaik dengan berbagai pilihan paket sesuai
                  budget Anda.
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    Garansi harga termurah!
                  </span>
                </p>
                <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-medium">
                  💰 Hemat hingga 30%
                </div>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="group relative overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative z-10">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Aman & Terpercaya
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Semua paket wisata telah terverifikasi dengan jaminan keamanan
                  perjalanan.
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    100% aman dan terjamin!
                  </span>
                </p>
                <div className="mt-6 flex items-center text-green-600 dark:text-green-400 font-medium">
                  🛡️ Sertifikat Resmi
                </div>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="group relative overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative z-10">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Layanan 24/7
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Customer service siap membantu Anda kapan saja selama 24 jam
                  setiap hari.
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    Respons cepat & ramah!
                  </span>
                </p>
                <div className="mt-6 flex items-center text-purple-600 dark:text-purple-400 font-medium">
                  🎧 Support Langsung
                </div>
              </CardContent>
            </Card>
          </div>
    </div>
  )
}

export default Features