import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    text: { type: String, maxlength: 4000, default: '' },
    media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
    hashtags: [{ type: String, lowercase: true, index: true }],
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    parentTweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', index: true },
    quoteTweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
    threadRoot: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
    poll: {
      question: String,
      options: [{ text: String, votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] }],
      expiresAt: Date
    },
    scheduledFor: Date,
    publishedAt: Date,
    draft: { type: Boolean, default: false },
    editedAt: Date,
    deletedAt: Date,
    metrics: {
      likes: { type: Number, default: 0 },
      reposts: { type: Number, default: 0 },
      replies: { type: Number, default: 0 },
      quotes: { type: Number, default: 0 },
      bookmarks: { type: Number, default: 0 },
      views: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

tweetSchema.index({ text: 'text', hashtags: 'text' });
tweetSchema.index({ author: 1, createdAt: -1 });

export const Tweet = mongoose.model('Tweet', tweetSchema);
