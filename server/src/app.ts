import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/api.routes';
import aiRoutes from './routes/ai.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { config } from './config';

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: config.clientUrl,
    credentials: true
  }));
  app.use(cookieParser(config.session.cookieSecret));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api', apiRoutes);
  app.use('/api/ai', aiRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Centralized Error handler
  app.use(errorHandler);

  return app;
};
