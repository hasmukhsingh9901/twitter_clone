import { Conversation, Message } from "../models/Message.js";
import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";

export const createConversation = asyncHandler(async (req, res) => {
  const participants = [
    ...new Set([String(req.user._id), ...req.body.participants]),
  ];
  const conversation = await Conversation.create({
    participants,
    title: req.body.title,
    isGroup: participants.length > 2,
  });
  ok(res, conversation, "Conversation created", 201);
});

export const listConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  }).populate("participants", "name username profileImage verified");
  ok(res, conversations);
});

export const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.conversationId,
    participants: req.user._id,
  });
  if (!conversation)
    return res
      .status(404)
      .json({ success: false, message: "Conversation not found" });
  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    text: req.body.text,
    media: req.body.media,
  });
  conversation.lastMessageAt = new Date();
  await conversation.save();
  await Promise.all(
    conversation.participants
      .filter((recipient) => String(recipient) !== String(req.user._id))
      .map((recipient) =>
        Notification.create({
          recipient,
          actor: req.user._id,
          type: "message",
          message: message._id,
        }),
      ),
  );
  ok(res, message, "Message sent", 201);
});

export const messageHistory = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    conversation: req.params.conversationId,
    deletedAt: null,
  }).populate("sender", "name username profileImage");
  ok(res, messages);
});
