import mongoose from "mongoose";
import "@/models/User";
import "@/models/Category";

const TravelPackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    // date: { type: Date, required: true },
    location: String,
    image: String, // URL dari Cloudinary nanti
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.TravelPackage ||
  mongoose.model("TravelPackage", TravelPackageSchema);
