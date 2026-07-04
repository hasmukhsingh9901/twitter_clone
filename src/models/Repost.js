import mongoose from 'mongoose';

const repostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: true }
  },
  { timestamps: true }
);

repostSchema.index({ user: 1, tweet: 1 }, { unique: true });

export const Repost = mongoose.model('Repost', repostSchema);
