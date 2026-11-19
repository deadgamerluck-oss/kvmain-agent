import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/api.routes';
import aiRoutes from './routes/ai.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { config } from './config';

export const createApp = (): Express => {
  const app = express();

  // Global CORS Handling & Preflight Options
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Session-Token, Cookie'
    );
    res.header('Access-Control-Expose-Headers', 'Set-Cookie, Authorization, X-Session-Token');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-Session-Token', 'Cookie']
  }));
  app.options('*', cors({ origin: true, credentials: true }));
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
