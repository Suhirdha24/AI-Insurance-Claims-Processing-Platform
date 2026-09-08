import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimiter';

import authRoutes from './routes/authRoutes';
import claimRoutes from './routes/claimRoutes';
import policyRoutes from './routes/policyRoutes';
import documentRoutes from './routes/documentRoutes';
import aiRoutes from './routes/aiRoutes';
import userRoutes from './routes/userRoutes';
import auditRoutes from './routes/auditRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl) or matching local/vercel/render environments
      if (!origin || origin.includes('localhost') || origin.includes('vercel.app') || origin.includes('onrender.com') || origin === config.corsOrigin) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// API Rate Limiter
app.use('/api', apiRateLimiter);

// Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), aiProvider: config.aiProvider });
});

// REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api', documentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
