import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";
import { env } from "../config/env.js";
import { Media } from "../models/Media.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024, files: 4 },
});

const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
        folder: "twitter-clone",
      },
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    Readable.from(file.buffer).pipe(stream);
  });

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!env.CLOUDINARY_CLOUD_NAME)
    return res
      .status(503)
      .json({ success: false, message: "Cloudinary is not configured" });
  const media = await Promise.all(
    (req.files || []).map(async (file) => {
      const result = await uploadToCloudinary(file);
      return Media.create({
        owner: req.user._id,
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        mimeType: file.mimetype,
        bytes: result.bytes,
      });
    }),
  );
  ok(res, media, "Media uploaded", 201);
});
