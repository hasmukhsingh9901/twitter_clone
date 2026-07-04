import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { changePassword, changePasswordSchema, login, loginSchema, logout, logoutAll, refresh, refreshSchema, register, registerSchema } from '../controllers/auth.controller.js';

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), register);
authRoutes.post('/login', validate(loginSchema), login);
authRoutes.post('/refresh', validate(refreshSchema), refresh);
authRoutes.post('/logout', validate(refreshSchema), logout);
authRoutes.post('/logout-all', requireAuth, logoutAll);
authRoutes.post('/change-password', requireAuth, validate(changePasswordSchema), changePassword);
