import NavbarCustomer from '@/components/NavbarCustomer'

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* <NavbarCustomer /> */}
      <main className="p-6">{children}</main>
    </div>
  )
}
