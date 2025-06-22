import mongoose from "mongoose"

const AdminNotificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    type: { type: String, enum: ['new_seller', 'updated_package'], required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'TravelPackage' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.AdminNotification ||
  mongoose.model("AdminNotification", AdminNotificationSchema)
