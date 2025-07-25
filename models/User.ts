import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "seller", "customer"], default: "customer" },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    phone: String,
    address: String,
    avatar: String,
    bio: String,
    wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TravelPackage',
    }
  ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
