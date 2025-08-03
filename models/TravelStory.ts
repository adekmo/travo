import mongoose, { Schema, models } from 'mongoose'

const travelStorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    packageId: { type: Schema.Types.ObjectId, ref: 'TravelPackage', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    media: [{ type: String }],
    tags: [{ type: String }],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default models.TravelStory || mongoose.model('TravelStory', travelStorySchema)
