"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RedirectPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        const role = session?.user?.role;

        if (role === "admin") router.replace("/dashboard/admin");
        else if (role === "seller") router.replace("/dashboard/seller");
        else if (role === "customer") router.replace("/packages");
        else router.replace("/auth/signin");
    }, [session, status, router]);
  return (
    <div>
        <p className="p-4">Redirecting...</p>
    </div>
  )
}

export default RedirectPage