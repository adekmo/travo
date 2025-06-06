'use client'

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

type Params = { id: string }

const BookingPages = ({ params }: { params: Promise<Params> }) => {
    const { id } = use(params)
    const { data: session } = useSession()
    const router = useRouter()
    const [numberOfPeople, setNumberOfPeople] = useState(1)
    const [note, setNote] = useState("")
    const [packageTitle, setPackageTitle] = useState("")

    useEffect(() => {
        const fetchPackage = async () => {
        const res = await fetch(`/api/packages/${id}`)
        if (res.ok) {
            const data = await res.json()
            setPackageTitle(data.title)
        }
        }
        fetchPackage()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            packageId: id,
            numberOfPeople,
            note,
        }),
        })
        if (res.ok) {
        router.push("/dashboard/customer") // atau halaman konfirmasi booking
        } else {
        alert("Gagal membuat booking")
        }
    }

    if (!session) return <p>Harap login terlebih dahulu</p>
  return (
    <div className="max-w-lg mx-auto mt-8 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Booking: {packageTitle}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Konfirmasi Booking
        </button>
      </form>
    </div>
  )
}

export default BookingPages