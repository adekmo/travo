export type Role = "admin" | "seller" | "customer";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isBlocked: boolean;
  phone?: string;
  address?: string;
  avatar?: string;
  bio?: string;
}
