import { Follow } from "../models/Follow.js";
import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";

export const followUser = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.userId);
  if (!target)
    return res.status(404).json({ success: false, message: "User not found" });
  const follow = await Follow.findOneAndUpdate(
    { follower: req.user._id, following: target._id },
    { status: target.private ? "pending" : "accepted" },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  if (
    follow.status === "accepted" &&
    String(target._id) !== String(req.user._id)
  ) {
    await Notification.create({
      recipient: target._id,
      actor: req.user._id,
      type: "follow",
    });
  }
  ok(res, follow, "Follow saved");
});

export const unfollowUser = asyncHandler(async (req, res) => {
  await Follow.deleteOne({
    follower: req.user._id,
    following: req.params.userId,
  });
  ok(res, null, "Unfollowed");
});

export const followers = asyncHandler(async (req, res) => {
  const items = await Follow.find({
    following: req.params.userId,
    status: "accepted",
  }).populate("follower", "name username profileImage verified");
  ok(
    res,
    items.map((item) => item.follower),
  );
});

export const following = asyncHandler(async (req, res) => {
  const items = await Follow.find({
    follower: req.params.userId,
    status: "accepted",
  }).populate("following", "name username profileImage verified");
  ok(
    res,
    items.map((item) => item.following),
  );
});
