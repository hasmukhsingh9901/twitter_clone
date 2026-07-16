import { Router } from 'express';
import { upload, uploadMedia } from '../controllers/media.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const mediaRoutes = Router();

mediaRoutes.post('/', requireAuth, upload.any(), uploadMedia);
