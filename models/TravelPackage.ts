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
    duration: { type: String, required: true },
    maxPeople: { type: Number, required: true },
    highlights: [{ type: String, required: true }],
    facilities: [
      {
        name: { type: String, required: true },
        icon: { type: String, required: false },
      },
    ],
    included: [{ type: String, required: true }],
    excluded: [{ type: String, required: true }],
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        activities: [{ type: String, required: true }],
        meals: { type: String },
        accommodation: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.TravelPackage ||
  mongoose.model("TravelPackage", TravelPackageSchema);
