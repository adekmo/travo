'use client'

import { Eye, EyeOff, Loader2, MapIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";


const SigninForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
        const [error, setError] = useState("");
        const router = useRouter();
        const [showPassword, setShowPassword] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
    
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };
    
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsLoading(true);
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
    
            setIsLoading(false);
        };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3">
              <MapIcon className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">Travoo</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Masuk ke Akun Anda</CardTitle>
            <p className="text-muted-foreground">
              Silakan masuk untuk melanjutkan...
            </p>
          </CardHeader>

          <CardContent>
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full border p-2 rounded"
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
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sedang masuk...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Belum punya akun?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary font-medium hover:underline"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  )
}

export default SigninForm