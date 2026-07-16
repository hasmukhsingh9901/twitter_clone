import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { seedDummyData } from '../src/scripts/seedDummyData.js';
import { Follow } from '../src/models/Follow.js';
import { Tweet } from '../src/models/Tweet.js';
import { User } from '../src/models/User.js';

let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.PORT = '5000';
  process.env.JWT_ACCESS_SECRET = 'test-access-secret-that-is-long-enough';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-that-is-long-enough';

  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

describe('seedDummyData', () => {
  it('creates a realistic sample dataset', async () => {
    const result = await seedDummyData();

    expect(result.summary.users).toBeGreaterThan(0);
    expect(result.summary.tweets).toBeGreaterThan(0);
    expect(result.summary.follows).toBeGreaterThan(0);

    const userCount = await User.countDocuments();
    const tweetCount = await Tweet.countDocuments();
    const followCount = await Follow.countDocuments();

    expect(userCount).toBe(result.summary.users);
    expect(tweetCount).toBe(result.summary.tweets);
    expect(followCount).toBe(result.summary.follows);
  });
});
