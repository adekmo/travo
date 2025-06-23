import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., 'register', 'add-package', 'update-package', 'delete-package'
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'TravelPackage' },
    message: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
