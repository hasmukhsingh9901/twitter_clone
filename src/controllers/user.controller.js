import { z } from "zod";
import { Follow } from "../models/Follow.js";
import { Tweet } from "../models/Tweet.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    bio: z.string().max(280).optional(),
    website: z.string().optional(),
    location: z.string().optional(),
    private: z.boolean().optional(),
    notificationPreferences: z.record(z.boolean()).optional(),
  }),
});

export const me = asyncHandler(async (req, res) => ok(res, req.user));

export const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  ok(res, user, "Profile updated");
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    username: req.params.username.toLowerCase(),
    status: "active",
  });
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  const [followers, following, tweets] = await Promise.all([
    Follow.countDocuments({ following: user._id, status: "accepted" }),
    Follow.countDocuments({ follower: user._id, status: "accepted" }),
    Tweet.countDocuments({ author: user._id, deletedAt: null, draft: false }),
  ]);
  ok(res, { ...user.toObject(), stats: { followers, following, tweets } });
});

export const searchUsers = asyncHandler(async (req, res) => {
  const q = req.query.q || "";
  const users = await User.find(
    q ? { $text: { $search: q }, status: "active" } : { status: "active" },
  ).limit(25);
  ok(res, users);
});

export const blockUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { blockedUsers: req.params.userId },
  });
  await Follow.deleteMany({
    $or: [
      { follower: req.user._id, following: req.params.userId },
      { follower: req.params.userId, following: req.user._id },
    ],
  });
  ok(res, null, "User blocked");
});

export const muteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { mutedUsers: req.params.userId },
  });
  ok(res, null, "User muted");
});
