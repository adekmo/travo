import mongoose, { Schema, models } from "mongoose";

const commentSchema = new Schema(
  {
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelStory",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Comment || mongoose.model("Comment", commentSchema);
