import { Router } from 'express';
import { createReport, dashboard, reports, updateReport } from '../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const adminRoutes = Router();

adminRoutes.post('/reports', requireAuth, createReport);
adminRoutes.get('/dashboard', requireAuth, requireRole('admin', 'moderator'), dashboard);
adminRoutes.get('/reports', requireAuth, requireRole('admin', 'moderator'), reports);
adminRoutes.patch('/reports/:reportId', requireAuth, requireRole('admin', 'moderator'), updateReport);
