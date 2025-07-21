import mongoose, { Schema, models } from 'mongoose'

const storyCommentSchema = new Schema(
  {
    storyId: { type: Schema.Types.ObjectId, ref: 'TravelStory', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
)

export default models.StoryComment || mongoose.model('StoryComment', storyCommentSchema)
