import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { seedDatabase } from './src/db/seed.ts';

// Routes
import authRoutes from './server/routes/auth.ts';
import userRoutes from './server/routes/users.ts';
import studentRoutes from './server/routes/students.ts';
import facultyRoutes from './server/routes/faculty.ts';
import parentRoutes from './server/routes/parents.ts';
import academicsRoutes from './server/routes/academics.ts';
import attendanceRoutes from './server/routes/attendance.ts';
import examRoutes from './server/routes/exams.ts';
import adminFeatureRoutes from './server/routes/admin-features.ts';
import cmsRoutes from './server/routes/cms.ts';
import dashboardRoutes from './server/routes/dashboard.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Seed initial college data if database is empty
  seedDatabase().catch((err) => {
    console.error('Seeding check failed:', err);
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/faculty', facultyRoutes);
  app.use('/api/parents', parentRoutes);
  app.use('/api/academics', academicsRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api', examRoutes);
  app.use('/api', adminFeatureRoutes);
  app.use('/api', cmsRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'SCSCO College Digital Platform API' });
  });

  // Vite middleware in dev or static files in production
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SCSCO Digital Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
