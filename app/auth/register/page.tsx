'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Eye, EyeOff, MapIcon } from "lucide-react";
import Link from "next/link";

const RegisterPage = () => {

    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password.length < 6) {
          setError("Password minimal 6 karakter");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
        router.push("/auth/signin");
        } else {
        setError(data.message || "Gagal mendaftar");
        }

        setLoading(false);
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/packages" className="inline-flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3">
              <MapIcon className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">Travoo</span>
          </Link>
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
            <p className="text-muted-foreground">
              Bergabunglah dengan komunitas travel terbesar di Indonesia
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full border p-2"
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                className="w-full border p-2"
                type="email"
                name="email"
                placeholder="name@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <select
                className="w-full border p-2"
                name="role"
                value={formData.role}
                onChange={handleChange}
                
              >
                <option value="customer">Customer</option>
                <option value="seller">Seller (Agent Travel)</option>
              </select>
              <div className="relative">
                <input
                  className="w-full border p-2"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Daftar"}
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Sudah punya akun?{" "}
                <Link
                  href="/auth/signin"
                  className="text-primary font-medium hover:underline"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default RegisterPage