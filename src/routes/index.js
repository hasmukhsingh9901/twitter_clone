import { Router } from 'express';
import { search } from '../controllers/search.controller.js';
import { seedDummyDataRoute } from '../controllers/seed.controller.js';
import { adminRoutes } from './admin.routes.js';
import { authRoutes } from './auth.routes.js';
import { followRoutes } from './follow.routes.js';
import { mediaRoutes } from './media.routes.js';
import { messageRoutes } from './message.routes.js';
import { notificationRoutes } from './notification.routes.js';
import { tweetRoutes } from './tweet.routes.js';
import { userRoutes } from './user.routes.js';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/tweets', tweetRoutes);
routes.use('/follows', followRoutes);
routes.use('/notifications', notificationRoutes);
routes.use('/messages', messageRoutes);
routes.use('/media', mediaRoutes);
routes.use('/admin', adminRoutes);
routes.get('/search', search);
routes.post('/seed', seedDummyDataRoute);
