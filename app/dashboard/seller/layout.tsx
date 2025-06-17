import Navbar from '@/components/Navbar'

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  )
}
