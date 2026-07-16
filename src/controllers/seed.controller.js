import { env } from '../config/env.js';
import { seedDummyData } from '../scripts/seedDummyData.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/response.js';

export const seedDummyDataRoute = asyncHandler(async (_req, res) => {
  if (env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Seeding is disabled in production' });
  }

  const result = await seedDummyData();
  ok(res, result, 'Dummy data seeded', 201);
});
