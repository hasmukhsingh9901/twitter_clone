import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate("actor", "name username profileImage verified")
    .sort({ createdAt: -1 });
  ok(res, notifications);
});

export const markRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.notificationId, recipient: req.user._id },
    { readAt: new Date() },
  );
  ok(res, null, "Notification marked read");
});
