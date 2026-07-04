import { Report } from '../models/Report.js';
import { Tweet } from '../models/Tweet.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/response.js';

export const dashboard = asyncHandler(async (_req, res) => {
  const [users, tweets, reports] = await Promise.all([User.countDocuments(), Tweet.countDocuments({ deletedAt: null }), Report.countDocuments({ status: 'open' })]);
  ok(res, { users, tweets, openReports: reports });
});

export const createReport = asyncHandler(async (req, res) => {
  const report = await Report.create({ reporter: req.user._id, ...req.body });
  ok(res, report, 'Report created', 201);
});

export const reports = asyncHandler(async (_req, res) => ok(res, await Report.find().sort({ createdAt: -1 })));

export const updateReport = asyncHandler(async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.reportId, { ...req.body, reviewedBy: req.user._id }, { new: true });
  ok(res, report, 'Report updated');
});
