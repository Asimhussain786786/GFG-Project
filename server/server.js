import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { db } from './models/storage.js';
import { authenticate } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import societyRoutes from './routes/societyRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(__filename);
const rootDir = path.resolve(currentDir, '..');
const publicDir = path.resolve(rootDir, 'public');
const uploadsDir = path.resolve(rootDir, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authenticate);

// Static assets
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(publicDir));

// Clean URL route mappings
const routeMap = {
  '/': 'index.html',
  '/societies': 'societies.html',
  '/society': 'society.html',
  '/events': 'events.html',
  '/event': 'event.html',
  '/login': 'login.html',
  '/signup': 'signup.html',
  '/admin-login': 'admin-login.html',
  '/admin-dashboard': 'admin-dashboard.html',
  '/profile': 'profile.html'
};

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/societies', societyRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/registrations', registrationRoutes);

Object.entries(routeMap).forEach(([routePath, htmlFile]) => {
  app.get(routePath, (_req, res) => {
    res.sendFile(path.join(publicDir, htmlFile));
  });
});

async function startServer() {
  await db.init();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 KIIT Society Hub running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => console.error(err));