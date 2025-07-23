'use client'

import { useSession } from "next-auth/react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfilePage = () => {

    const { data: session } = useSession();
    // const user = session?.user;
    const router = useRouter();

    const [form, setForm] = useState({
      name: '',
      phone: '',
      address: '',
      avatar: '',
      bio: '',
    })

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const res = await fetch('/api/profile')
          if (res.ok) {
            const data = await res.json()
            setForm({
              name: data.name || '',
              phone: data.phone || '',
              address: data.address || '',
              avatar: data.avatar || '',
              bio: data.bio || '',
            })
          }
        } catch (err) {
          console.error('Gagal mengambil data profil:', err)
        }
      }

      fetchProfile()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar */}
        <div>
          <label className="block font-medium mb-1">Foto Profil</label>
          {form.avatar && (
            <Image
              src={form.avatar}
              alt="Avatar"
              width={20}
              height={20}
              className="w-20 h-20 rounded-full mb-2 object-cover"
            />
          )}
          <CldUploadWidget
            uploadPreset="recipe_upload"
            onSuccess={(result: any) => {
              setForm((prev) => ({
                ...prev,
                avatar: result.info.secure_url,
              }))
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="bg-gray-200 px-3 py-1 rounded text-sm"
              >
                Upload Avatar
              </button>
            )}
          </CldUploadWidget>
        </div>

        {/* Nama */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama"
          className="w-full p-2 border rounded"
          required
        />

        {/* Nomor Telepon */}
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Nomor Telepon"
          className="w-full p-2 border rounded"
        />

        {/* Alamat */}
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Alamat"
          className="w-full p-2 border rounded"
        />

        {/* Bio */}
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Deskripsi singkat / bio"
          className="w-full p-2 border rounded"
          rows={3}
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  )
}

export default ProfilePage