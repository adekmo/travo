import mongoose, { Schema, models } from 'mongoose'

const notificationSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    packageId: { type: Schema.Types.ObjectId, ref: 'TravelPackage', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Notification = models.Notification || mongoose.model('Notification', notificationSchema)
export default Notification
