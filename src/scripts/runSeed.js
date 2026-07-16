import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { seedDummyData } from './seedDummyData.js';

const run = async () => {
  await connectDB();
  const result = await seedDummyData();
  console.log('Seed complete', result.summary);
  process.exit(0);
};

run().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
