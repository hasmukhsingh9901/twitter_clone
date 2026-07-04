import { Router } from 'express';
import { bookmarkTweet, createTweet, deleteTweet, getTweet, likeTweet, repostTweet, timeline, tweetSchema, updateTweet } from '../controllers/tweet.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

export const tweetRoutes = Router();

tweetRoutes.get('/timeline', requireAuth, timeline);
tweetRoutes.post('/', requireAuth, validate(tweetSchema), createTweet);
tweetRoutes.get('/:tweetId', getTweet);
tweetRoutes.patch('/:tweetId', requireAuth, updateTweet);
tweetRoutes.delete('/:tweetId', requireAuth, deleteTweet);
tweetRoutes.post('/:tweetId/like', requireAuth, likeTweet);
tweetRoutes.post('/:tweetId/bookmark', requireAuth, bookmarkTweet);
tweetRoutes.post('/:tweetId/repost', requireAuth, repostTweet);
