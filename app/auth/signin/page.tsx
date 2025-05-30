"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignInPage = () => {

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        });

        if (res?.error) {
          if (res.error === "UserBlocked") {
            setError("Akun Anda telah diblokir oleh admin. Silahkan hubungi Admin untuk melakukan Banding");
          } else {
            setError("Email atau password salah");
          }
        } else {
        router.push("/redirect"); //
        }
    };
  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Belum punya akun?{" "}
        <a href="/auth/register" className="text-blue-600 underline">
          Daftar di sini
        </a>
      </p>
    </div>
  )
}

export default SignInPage