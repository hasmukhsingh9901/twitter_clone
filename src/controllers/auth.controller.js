import mongoose from "mongoose";
import { z } from "zod";
import { RefreshToken } from "../models/RefreshToken.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    username: z
      .string()
      .min(3)
      .regex(/^[a-zA-Z0-9_]+$/),
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    emailOrUsername: z.string().min(1),
    password: z.string().min(1),
  }),
});

export const refreshSchema = z.object({
  body: z.object({ refreshToken: z.string().min(20) }),
});
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8),
  }),
});

const issueTokens = async (
  user,
  family = new mongoose.Types.ObjectId().toString(),
) => {
  const tokenId = new mongoose.Types.ObjectId().toString();
  const refreshToken = signRefreshToken(user, tokenId);
  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    family,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  return { accessToken: signAccessToken(user), refreshToken };
};

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  username: user.username,
  email: user.email,
  bio: user.bio,
  role: user.role,
  verified: user.verified,
  private: user.private,
});

export const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  ok(
    res,
    { user: publicUser(user), ...(await issueTokens(user)) },
    "Registered",
    201,
  );
});

export const login = asyncHandler(async (req, res) => {
  const value = req.body.emailOrUsername.toLowerCase();
  const user = await User.findOne({
    $or: [{ email: value }, { username: value }],
  }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password)))
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  ok(
    res,
    { user: publicUser(user), ...(await issueTokens(user)) },
    "Logged in",
  );
});

export const refresh = asyncHandler(async (req, res) => {
  const payload = verifyRefreshToken(req.body.refreshToken);
  const oldToken = await RefreshToken.findOne({
    tokenHash: hashToken(req.body.refreshToken),
    revokedAt: null,
  });
  if (!oldToken)
    return res
      .status(401)
      .json({ success: false, message: "Refresh token is invalid or reused" });
  oldToken.revokedAt = new Date();
  await oldToken.save();
  const user = await User.findById(payload.sub);
  ok(res, await issueTokens(user, oldToken.family), "Token refreshed");
});

export const logout = asyncHandler(async (req, res) => {
  await RefreshToken.findOneAndUpdate(
    { tokenHash: hashToken(req.body.refreshToken) },
    { revokedAt: new Date() },
  );
  ok(res, null, "Logged out");
});

export const logoutAll = asyncHandler(async (req, res) => {
  await RefreshToken.updateMany(
    { user: req.user._id, revokedAt: null },
    { revokedAt: new Date() },
  );
  ok(res, null, "Logged out from all devices");
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(req.body.currentPassword)))
    return res
      .status(400)
      .json({ success: false, message: "Current password is incorrect" });
  user.password = req.body.newPassword;
  await user.save();
  await RefreshToken.updateMany(
    { user: user._id, revokedAt: null },
    { revokedAt: new Date() },
  );
  ok(res, null, "Password changed");
});
