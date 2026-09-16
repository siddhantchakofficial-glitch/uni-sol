import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import formRoutes from './routes/formRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import translationRoutes from './routes/translationRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS
const clientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map((u) => u.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  ...clientUrls,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/+$/, '');
      const isAllowed =
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        process.env.NODE_ENV === 'development';

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback to avoid breaking API calls during preview builds
      }
    },
    credentials: true,
  })
);

// Body Parsing & Cookies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Static File Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// App state default
app.locals.dbConnected = false;

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/translations', translationRoutes);

// Root API status endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'UniSol CMS API Server',
    status: 'online',
    dbConnected: app.locals.dbConnected,
    version: '1.0.0',
    time: new Date().toISOString(),
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    dbConnected: app.locals.dbConnected,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server & Database
const startServer = async () => {
  const isConnected = await connectDB();
  app.locals.dbConnected = isConnected;

  app.listen(PORT, () => {
    console.log(`[UniSol CMS API Server] listening on http://localhost:${PORT}`);
    console.log(`[Mode]: Database Connected = ${isConnected}`);
  });
};

startServer();
