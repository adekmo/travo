'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProfilePage = () => {

    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();

    const [form, setForm] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        address: user?.address || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Gagal update profil");

            router.back();
        } catch (err: any) {
            alert(err.message);
        }
    };
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profil Saya</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Nomor Telepon"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Alamat"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          Simpan Perubahan
        </button>
      </form>
    </div>
  )
}

export default ProfilePage