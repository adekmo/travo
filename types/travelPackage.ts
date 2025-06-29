import { User } from "./user";

export interface TravelPackage  {
  _id?: string;
  title: string;
  description: string;
  price: number;
  // date: string;
  location: string;
  image?: string;
  seller: User
  category?: {
    _id: string
    name: string
  }
};