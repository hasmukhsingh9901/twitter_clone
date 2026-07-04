import { Router } from 'express';
import { createConversation, listConversations, messageHistory, sendMessage } from '../controllers/message.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const messageRoutes = Router();

messageRoutes.get('/conversations', requireAuth, listConversations);
messageRoutes.post('/conversations', requireAuth, createConversation);
messageRoutes.get('/conversations/:conversationId/messages', requireAuth, messageHistory);
messageRoutes.post('/conversations/:conversationId/messages', requireAuth, sendMessage);
