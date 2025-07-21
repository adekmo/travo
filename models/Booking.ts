import mongoose from "mongoose";
import "@/models/TravelPackage";

const BookingSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "TravelPackage", required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    numberOfPeople: Number,
    note: String,
    hasReviewed: { type: Boolean, default: false },
    hasStory: { type: Boolean, default: false },
    contact: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
