import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // 1. Allow public routes (register, login, homepage, etc.)
  const publicPaths = ["/", "/auth/signin", "/auth/register"];
  if (publicPaths.includes(pathname)) return NextResponse.next();

  // 2. If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // 3. Role-based protection
  const role = token.role;

  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/dashboard/seller") && role !== "seller") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/dashboard/customer") && role !== "customer") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", // proteksi semua dashboard
    "/protected/:path*", // kalau kamu buat folder lain yg ingin diproteksi
  ],
};
