import { Router } from 'express';
import { listNotifications, markRead } from '../controllers/notification.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const notificationRoutes = Router();

notificationRoutes.get('/', requireAuth, listNotifications);
notificationRoutes.patch('/:notificationId/read', requireAuth, markRead);
