'use client'
// import NavbarAdmin from '@/components/NavbarAdmin'
import Sidebar from '@/components/Sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push('/auth/signin');
        } else if (session.user.role !== 'admin') {
            router.push('/');
        }
    }, [session, status, router]);

    if (status === 'loading' || !session || session.user.role !== 'admin') {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
  return (
    <div>
      {/* <NavbarAdmin /> */}
      <Sidebar role={session.user.role}>
            {children}
      </Sidebar>
    </div>
  )
}
