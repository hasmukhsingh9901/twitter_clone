import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['like', 'reply', 'mention', 'follow', 'repost', 'quote', 'message', 'system'], required: true },
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
    message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    readAt: Date,
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
