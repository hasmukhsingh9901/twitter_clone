import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, enum: ['image', 'video', 'raw'], default: 'image' },
    mimeType: String,
    bytes: Number
  },
  { timestamps: true }
);

export const Media = mongoose.model('Media', mediaSchema);
