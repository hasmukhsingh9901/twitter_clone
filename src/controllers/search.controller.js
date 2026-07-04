import { Hashtag } from "../models/Hashtag.js";
import { Tweet } from "../models/Tweet.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";

export const search = asyncHandler(async (req, res) => {
  const q = req.query.q || "";
  const [users, tweets, hashtags] = await Promise.all([
    User.find(
      q ? { $text: { $search: q }, status: "active" } : { status: "active" },
    ).limit(10),
    Tweet.find(
      q ? { $text: { $search: q }, deletedAt: null } : { deletedAt: null },
    )
      .populate("author", "name username profileImage verified")
      .limit(20),
    Hashtag.find(q ? { tag: new RegExp(q, "i") } : {})
      .sort({ tweetCount: -1 })
      .limit(10),
  ]);
  ok(res, { users, tweets, hashtags });
});
