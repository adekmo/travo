import mongoose from "mongoose";
import "@/models/TravelPackage";
import "@/models/User";


const ReviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelPackage",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hindari review ganda untuk satu booking
ReviewSchema.index({ customer: 1, package: 1 }, { unique: true });

export default mongoose.models.Review ||
  mongoose.model("Review", ReviewSchema);
