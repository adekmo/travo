'use client'

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type Params = { id: string }

const BookingPages = ({ params }: { params: Promise<Params> }) => {
    const { id } = use(params)
    const { data: session } = useSession()
    const router = useRouter()
    const [numberOfPeople, setNumberOfPeople] = useState(1)
    const [note, setNote] = useState("")
    const [date, setDate] = useState<Date | null>(null)
    const [packageTitle, setPackageTitle] = useState('')
    // const [error, setError] = useState('')
    // const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      const fetchPackage = async () => {
        const res = await fetch(`/api/packages/${id}`)
        if (res.ok) {
          const data = await res.json()
          setPackageTitle(data.title)
        } else {
          setPackageTitle('Paket tidak ditemukan')
        }
      }
      fetchPackage()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!session?.user) return toast.error("User tidak ditemukan")

      if (!date) return toast.error("Pilih tanggal keberangkatan")

      setLoading(true)
      // setError("")
      // setSuccess("")

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: session.user.id,
          packageId: id,
          date,
          numberOfPeople,
          note,
        }),
      })

      const result = await res.json()

      if (res.ok) {
        toast.success("Booking berhasil!")
        // setSuccess("Booking berhasil!")
        setDate(null)
        setNumberOfPeople(1)
        setNote("")
        setTimeout(() => {
          router.push("/dashboard/customer")
        }, 1500)
      } else {
        toast.error(result.message || "Gagal membuat booking")
        setTimeout(() => {
          router.push("/auth/signin")
        }, 1500)
      }

      setLoading(false)
    }

  if (!session) return <p className="text-center mt-8">Harap login terlebih dahulu</p>
  return (
    <div className="max-w-lg mx-auto mt-8 p-6 border rounded shadow">
      <ToastContainer position="top-center" autoClose={2000} />
      <h1 className="text-2xl font-bold mb-4">Booking: {packageTitle}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Tanggal Keberangkatan</label>
          <DatePicker
            selected={date}
            onChange={(date: Date | null) => setDate(date)}
            minDate={new Date()}
            className="w-full p-2 border rounded"
            placeholderText="Pilih tanggal"
          />
        </div>
        <div>
          <label className="block mb-1">Jumlah Orang</label>
          <input
            type="number"
            min={1}
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Catatan (opsional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed`}
        >
          {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Memproses...
          </>
        ) : (
          "Konfirmasi Booking"
        )}
        </button>
        {/* <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Konfirmasi Booking
        </button> */}
      </form>
    </div>
  )
}

export default BookingPages