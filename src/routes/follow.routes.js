import { Router } from 'express';
import { followUser, followers, following, unfollowUser } from '../controllers/follow.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const followRoutes = Router();

followRoutes.post('/:userId', requireAuth, followUser);
followRoutes.delete('/:userId', requireAuth, unfollowUser);
followRoutes.get('/:userId/followers', followers);
followRoutes.get('/:userId/following', following);
