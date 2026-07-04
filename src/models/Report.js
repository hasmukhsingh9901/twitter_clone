import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetTweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
    reason: { type: String, required: true },
    status: { type: String, enum: ['open', 'reviewing', 'resolved', 'dismissed'], default: 'open' },
    resolution: String,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const Report = mongoose.model('Report', reportSchema);
