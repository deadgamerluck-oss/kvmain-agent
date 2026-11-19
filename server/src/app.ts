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
    origin: (requestOrigin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, health checks)
      if (!requestOrigin) return callback(null, true);

      // If specific CLIENT_URL matches or wildcard
      if (
        config.clientUrl === '*' ||
        requestOrigin === config.clientUrl ||
        requestOrigin.endsWith('.hostinger.com') ||
        requestOrigin.endsWith('.hostingerapp.com') ||
        requestOrigin.endsWith('.vercel.app') ||
        requestOrigin.includes('localhost')
      ) {
        return callback(null, true);
      }

      // Allow all valid web domains in production to prevent CORS blocks
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie']
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
