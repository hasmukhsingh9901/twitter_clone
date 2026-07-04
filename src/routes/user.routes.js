import { Router } from 'express';
import { blockUser, getProfile, me, muteUser, searchUsers, updateMe, updateProfileSchema } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

export const userRoutes = Router();

userRoutes.get('/me', requireAuth, me);
userRoutes.patch('/me', requireAuth, validate(updateProfileSchema), updateMe);
userRoutes.get('/search', requireAuth, searchUsers);
userRoutes.get('/:username', getProfile);
userRoutes.post('/:userId/block', requireAuth, blockUser);
userRoutes.post('/:userId/mute', requireAuth, muteUser);
