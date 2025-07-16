'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import { Button } from './ui/Button'
import { Textarea } from './ui/Textarea'
import { Label } from './ui/Label'
import { Input } from './ui/Input'
import { Mail, Phone, User, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'

interface BookingModalProps {
  packageId: string
  packageTitle: string
  pricePerPerson: number
  maxPeople: number
  onSuccess?: () => void
}

const BookingModal = ({
  packageId,
  packageTitle,
  maxPeople,
  pricePerPerson,
  onSuccess,
}: BookingModalProps) => {
  const { data: session } = useSession()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date | null>(null)
  const [numberOfPeople, setNumberOfPeople] = useState(1)
  const [name, setName] = useState(session?.user.name ?? '')
  const [email, setEmail] = useState(session?.user.email ?? '')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [specialRequest, setSpecialRequest] = useState('')
  const [loading, setLoading] = useState(false)

  const totalPrice = pricePerPerson * numberOfPeople

  const handleSubmit = async () => {
    if (!session?.user) {
      return toast.error('Silakan login terlebih dahulu')
    }

    if (!date) return toast.error('Pilih tanggal keberangkatan')

    setLoading(true)

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: session.user.id,
        packageId,
        date,
        numberOfPeople,
        note: `Pantangan: ${note} | Permintaan Khusus: ${specialRequest}`,
        contact: { name, email, phone },
      }),
    })

    const result = await res.json()

    if (res.ok) {
      toast.success('Booking berhasil!')
      if (onSuccess) onSuccess()
      setTimeout(() => router.push('/dashboard/customer'), 1500)
    } else {
      toast.error(result.message || 'Gagal membuat booking')
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
        {/* Progress Bar */}
        <div className='flex items-center space-x-4'>
            
        </div>
      {step === 1 && (
        <>
          <div>
                <h3 className="text-lg font-semibold mb-4">
                    Pilih Tanggal & Jumlah Peserta
                </h3>
            </div>
            <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                    <Label>Tanggal Keberangkatan</Label>
                    <DatePicker
                        selected={date}
                        onChange={setDate}
                        minDate={new Date()}
                        className="w-full p-2 border rounded"
                        placeholderText="Pilih tanggal"
                    />
                </div>
                <div className='flex items-center gap-2'>
                    <Label className="mt-2">Jumlah Orang</Label>
                    <div className='flex items-center justify-between bg-gray-50 rounded-lg p-4 mt-2'>
                        <div className='flex items-center gap-3'>
                            <Users className="h-5 w-5 text-gray-600" />
                            <Input
                                type="number"
                                value={numberOfPeople}
                                onChange={(e) => {
                                    const value = Number(e.target.value)
                                    if (value <= maxPeople) {
                                    setNumberOfPeople(value)
                                    } else {
                                    toast.warn(`Jumlah peserta tidak boleh lebih dari ${maxPeople}`)
                                    }
                                }}
                                min={1}
                                max={maxPeople}
                            />
                            <div className="text-sm text-gray-600">
                            Maksimal {maxPeople} orang
                            </div>
                        </div>
                    </div>   
                </div>
                <div className='flex items-center gap-2'>
                    <Button onClick={() => setStep(2)} className="mt-4 w-full">
                        Lanjutkan
                    </Button>
                </div>
            </div>
        </>
      )}

      {step === 2 && (
        <>
            <div>
                <h3 className="text-lg font-semibold mb-4">2. Informasi Kontak</h3>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <Label>Nama Lengkap</Label>
                        <div className='relative'>
                            <Input value={name} onChange={(e) => setName(e.target.value)} required />
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <Label>Email</Label>
                        <div className='relative'>
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <Label>No. Telepon</Label>
                        <div className='relative'>
                            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div className='mt-2'>
                    <Label>Pantangan Makanan (Opsional)</Label>
                    <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
                <div className='mt-2'>
                    <Label>Permintaan Khusus (Opsional)</Label>
                    <Textarea value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} />
                </div>
            </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              Kembali
            </Button>
            <Button onClick={() => setStep(3)}>Lanjutkan</Button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
            <div className='space-y-3'>
                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        Ringkasan & Pembayaran
                    </h3>

                    {/* Booking Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Booking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='flex justify-between text-sm'>
                                <span>Paket:</span>
                                <span className="font-medium">
                                {packageTitle}
                                </span>
                            </div>
                            <div className='flex justify-between text-sm'>
                                <span>Jumlag Peserta:</span>
                                <span className="font-medium">{numberOfPeople} orang</span>
                            </div>
                            <div className='flex justify-between text-sm'>
                                <span>Tanggal:</span>
                                <span className="font-medium">{date?.toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                        <CardTitle className="text-base">Rincian Harga</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>Harga paket × {numberOfPeople} orang</span>
                            <span className='text-lg font-bold text-blue-600'>Rp {totalPrice.toLocaleString()}</span>
                        </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

          {/* opsi metode pembayaran di sini */}

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setStep(2)}>
              Kembali
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Memproses...' : 'Konfirmasi Booking'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default BookingModal
