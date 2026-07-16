import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import pino from 'pino';
import pinoHttp from 'pino-http';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.js';
import { routes } from './routes/index.js';

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'Twitter Clone API', version: '1.0.0' },
    servers: [{ url: `http://localhost:${env.PORT}` }]
  },
  apis: ['./src/routes/*.js']
});

export const createApp = () => {
  const app = express();

  // connectDB();
  app.use(helmet());
  app.use(cors({ origin: "https://x-frontend-cyan.vercel.app", credentials: true }));
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(mongoSanitize());
  app.use(hpp());
  app.use(pinoHttp({ logger: pino({ level: env.NODE_ENV === 'test' ? 'silent' : 'info' }) }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: env.NODE_ENV === 'test' ? 1000 : 300 }));
  app.get('/health', (_req, res) => res.json({ success: true, message: 'healthy' }));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/v1', routes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
};
