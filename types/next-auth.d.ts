// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "admin" | "seller" | "customer";
      isVerified: boolean;
      phone?: string;
      address?: string;
    };
  }

  interface User {
    id: string;
    role: "admin" | "seller" | "customer";
    
  }
}
