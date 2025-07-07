import { Clock, Shield, TrendingUp } from 'lucide-react'
import React from 'react'

const Features = () => {
  return (
    <div className='mt-10'>
        <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Mengapa Memilih Travoo?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami berkomitmen memberikan pengalaman wisata terbaik dengan
              layanan profesional dan terpercaya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border-0 shadow-md">
              <div className="p-0">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Harga Terbaik</h3>
                <p className="text-muted-foreground">
                  Dapatkan harga terbaik dengan berbagai pilihan paket sesuai
                  budget Anda.
                </p>
              </div>
            </div>

            <div className="text-center p-6 border-0 shadow-md">
              <div className="p-0">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Aman & Terpercaya
                </h3>
                <p className="text-muted-foreground">
                  Semua paket wisata telah terverifikasi dengan jaminan keamanan
                  perjalanan.
                </p>
              </div>
            </div>

            <div className="text-center p-6 border-0 shadow-md">
              <div className="p-0">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Layanan 24/7</h3>
                <p className="text-muted-foreground">
                  Customer service siap membantu Anda kapan saja selama 24 jam
                  setiap hari.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features