import mongoose from 'mongoose';

const hashtagSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true, unique: true, lowercase: true },
    tweetCount: { type: Number, default: 0 },
    lastUsedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Hashtag = mongoose.model('Hashtag', hashtagSchema);
