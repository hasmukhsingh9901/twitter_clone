import { Bookmark } from '../models/Bookmark.js';
import { Follow } from '../models/Follow.js';
import { Like } from '../models/Like.js';
import { Notification } from '../models/Notification.js';
import { Repost } from '../models/Repost.js';
import { Tweet } from '../models/Tweet.js';
import { User } from '../models/User.js';

const usersData = [
  { name: 'Ava Chen', username: 'ava', email: 'ava@example.com', password: 'Password123', bio: 'Building products and stories.', location: 'Singapore', verified: true },
  { name: 'Leo Martinez', username: 'leo', email: 'leo@example.com', password: 'Password123', bio: 'Coffee, code, and cameras.', location: 'Barcelona', verified: false },
  { name: 'Nia Patel', username: 'nia', email: 'nia@example.com', password: 'Password123', bio: 'Loves open source and design systems.', location: 'London', verified: true },
  { name: 'Mika Owen', username: 'mika', email: 'mika@example.com', password: 'Password123', bio: 'Shipping fast and learning faster.', location: 'Toronto' },
  { name: 'Samir Khan', username: 'samir', email: 'samir@example.com', password: 'Password123', bio: 'Exploring AI products.', location: 'Dubai', verified: true }
];

const tweetTemplates = [
  'Shipping the first version of the new dashboard today. #buildinpublic',
  'Weekend plans: coffee, code, and a long walk. #weekend',
  'The best product ideas usually come from listening carefully. #product',
  'A tiny improvement can change the entire experience. #ux',
  'The team is moving fast and the momentum feels amazing. #teamwork',
  'There is always room to simplify the workflow. #engineering'
];

export const seedDummyData = async () => {
  await Promise.all([
    User.deleteMany({}),
    Tweet.deleteMany({}),
    Follow.deleteMany({}),
    Like.deleteMany({}),
    Bookmark.deleteMany({}),
    Repost.deleteMany({}),
    Notification.deleteMany({})
  ]);

  const createdUsers = await User.create(usersData);

  const tweets = [];
  for (let index = 0; index < 12; index += 1) {
    const author = createdUsers[index % createdUsers.length];
    const text = tweetTemplates[index % tweetTemplates.length];
    tweets.push({
      author: author._id,
      text: `${text} (${index + 1})`,
      hashtags: ['buildinpublic', 'weekend', 'product', 'ux', 'teamwork', 'engineering'].slice(0, 2 + (index % 3)),
      publishedAt: new Date(Date.now() - index * 60 * 60 * 1000)
    });
  }

  const createdTweets = await Tweet.create(tweets);

  const followPairs = [];
  for (const user of createdUsers) {
    for (const target of createdUsers.filter((candidate) => String(candidate._id) !== String(user._id))) {
      if (followPairs.length < createdUsers.length * 2) {
        followPairs.push({ follower: user._id, following: target._id, status: 'accepted' });
      }
    }
  }

  const createdFollows = await Follow.create(followPairs.slice(0, 8));

  await Promise.all(createdTweets.slice(0, 6).map(async (tweet, index) => {
    const liker = createdUsers[(index + 1) % createdUsers.length];
    const bookmarker = createdUsers[(index + 2) % createdUsers.length];
    const reposter = createdUsers[(index + 3) % createdUsers.length];

    await Like.create({ user: liker._id, tweet: tweet._id });
    await Bookmark.create({ user: bookmarker._id, tweet: tweet._id });
    await Repost.create({ user: reposter._id, tweet: tweet._id });

    await Notification.create({ recipient: tweet.author, actor: liker._id, type: 'like', tweet: tweet._id });
  }));

  return {
    summary: {
      users: createdUsers.length,
      tweets: createdTweets.length,
      follows: createdFollows.length,
      likes: 6,
      bookmarks: 6,
      reposts: 6
    }
  };
};
