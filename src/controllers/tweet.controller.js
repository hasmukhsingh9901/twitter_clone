import { z } from "zod";
import { Bookmark } from "../models/Bookmark.js";
import { Hashtag } from "../models/Hashtag.js";
import { Like } from "../models/Like.js";
import { Notification } from "../models/Notification.js";
import { Repost } from "../models/Repost.js";
import { Tweet } from "../models/Tweet.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";

export const tweetSchema = z.object({
  body: z.object({
    text: z.string().max(4000).default(""),
    media: z.array(z.string()).optional(),
    parentTweet: z.string().optional(),
    quoteTweet: z.string().optional(),
    threadRoot: z.string().optional(),
    poll: z.any().optional(),
    scheduledFor: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

const hashtags = (text = "") => [
  ...new Set(
    (text.match(/#[\p{L}\p{N}_]+/gu) || []).map((tag) =>
      tag.slice(1).toLowerCase(),
    ),
  ),
];
const usernames = (text = "") => [
  ...new Set(
    (text.match(/@[a-zA-Z0-9_]+/g) || []).map((tag) =>
      tag.slice(1).toLowerCase(),
    ),
  ),
];
const populateTweet = (query) =>
  query
    .populate("author", "name username profileImage verified")
    .populate("media")
    .populate("quoteTweet");

export const createTweet = asyncHandler(async (req, res) => {
  const tags = hashtags(req.body.text);
  const mentionedUsers = await User.find({
    username: { $in: usernames(req.body.text) },
  }).select("_id");
  const tweet = await Tweet.create({
    ...req.body,
    author: req.user._id,
    hashtags: tags,
    mentions: mentionedUsers.map((user) => user._id),
    publishedAt:
      req.body.draft || req.body.scheduledFor ? undefined : new Date(),
  });
  await Promise.all(
    tags.map((tag) =>
      Hashtag.findOneAndUpdate(
        { tag },
        { $inc: { tweetCount: 1 }, lastUsedAt: new Date() },
        { upsert: true },
      ),
    ),
  );
  if (req.body.parentTweet)
    await Tweet.findByIdAndUpdate(req.body.parentTweet, {
      $inc: { "metrics.replies": 1 },
    });
  if (req.body.quoteTweet)
    await Tweet.findByIdAndUpdate(req.body.quoteTweet, {
      $inc: { "metrics.quotes": 1 },
    });
  await Notification.insertMany(
    mentionedUsers
      .filter((user) => String(user._id) !== String(req.user._id))
      .map((user) => ({
        recipient: user._id,
        actor: req.user._id,
        type: "mention",
        tweet: tweet._id,
      })),
  );
  ok(res, await populateTweet(Tweet.findById(tweet._id)), "Tweet created", 201);
});

export const updateTweet = asyncHandler(async (req, res) => {
  const tweet = await Tweet.findOne({
    _id: req.params.tweetId,
    author: req.user._id,
    deletedAt: null,
  });
  if (!tweet)
    return res.status(404).json({ success: false, message: "Tweet not found" });
  Object.assign(tweet, req.body, { editedAt: new Date() });
  if (req.body.text) tweet.hashtags = hashtags(req.body.text);
  await tweet.save();
  ok(res, await populateTweet(Tweet.findById(tweet._id)), "Tweet updated");
});

export const deleteTweet = asyncHandler(async (req, res) => {
  await Tweet.findOneAndUpdate(
    { _id: req.params.tweetId, author: req.user._id },
    { deletedAt: new Date() },
  );
  ok(res, null, "Tweet deleted");
});

export const getTweet = asyncHandler(async (req, res) => {
  await Tweet.findByIdAndUpdate(req.params.tweetId, {
    $inc: { "metrics.views": 1 },
  });
  const tweet = await populateTweet(
    Tweet.findOne({ _id: req.params.tweetId, deletedAt: null }),
  );
  if (!tweet)
    return res.status(404).json({ success: false, message: "Tweet not found" });
  ok(res, tweet);
});

export const timeline = asyncHandler(async (req, res) => {
  const tweets = await populateTweet(
    Tweet.find({ deletedAt: null, draft: false })
      .sort({ createdAt: -1 })
      .limit(50),
  );
  ok(res, tweets);
});

export const likeTweet = asyncHandler(async (req, res) => {
  const tweet = await Tweet.findById(req.params.tweetId);
  await Like.updateOne(
    { user: req.user._id, tweet: tweet._id },
    { $setOnInsert: { user: req.user._id, tweet: tweet._id } },
    { upsert: true },
  );
  await Tweet.findByIdAndUpdate(tweet._id, { $inc: { "metrics.likes": 1 } });
  if (String(tweet.author) !== String(req.user._id))
    await Notification.create({
      recipient: tweet.author,
      actor: req.user._id,
      type: "like",
      tweet: tweet._id,
    });
  ok(res, null, "Tweet liked");
});

export const bookmarkTweet = asyncHandler(async (req, res) => {
  await Bookmark.updateOne(
    { user: req.user._id, tweet: req.params.tweetId },
    { $setOnInsert: { user: req.user._id, tweet: req.params.tweetId } },
    { upsert: true },
  );
  ok(res, null, "Tweet bookmarked");
});

export const repostTweet = asyncHandler(async (req, res) => {
  const tweet = await Tweet.findById(req.params.tweetId);
  await Repost.updateOne(
    { user: req.user._id, tweet: tweet._id },
    { $setOnInsert: { user: req.user._id, tweet: tweet._id } },
    { upsert: true },
  );
  await Tweet.findByIdAndUpdate(tweet._id, { $inc: { "metrics.reposts": 1 } });
  if (String(tweet.author) !== String(req.user._id))
    await Notification.create({
      recipient: tweet.author,
      actor: req.user._id,
      type: "repost",
      tweet: tweet._id,
    });
  ok(res, null, "Tweet reposted");
});
