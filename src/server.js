import { createClient } from 'redis';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

await connectDB();

const redis = createClient({ url: env.REDIS_URL });
redis.on('error', () => {});
redis.connect().catch(() => {});

createApp().listen(env.PORT, () => {
  console.log(`API running on port ${env.PORT}`);
});
