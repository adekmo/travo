import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    numberOfPeople: Number,
    note: String,
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
