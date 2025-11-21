import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { dbPool } from './lib/database.js';
import { redisClient } from './lib/redis.js';
import { minioClient } from './lib/minio.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4243;

// ============================================
// Middleware
// ============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const corsOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:2272'];
app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/cms/admin/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // Higher limit for admin operations
}));

app.use('/api/cms/public/', limiter);

// ============================================
// Routes
// ============================================
import blogRoutes from './routes/blog.js';
import pagesRoutes from './routes/pages.js';
import pricingRoutes from './routes/pricing.js';
import promotionsRoutes from './routes/promotions.js';
import testimonialsRoutes from './routes/testimonials.js';
import faqsRoutes from './routes/faqs.js';
import mediaRoutes from './routes/media.js';
import seoRoutes from './routes/seo.js';
import analyticsRoutes from './routes/analytics.js';
import authRoutes from './routes/auth.js';
import adminBlogRoutes from './routes/admin/blog.js';
import adminPagesRoutes from './routes/admin/pages.js';
import adminPricingRoutes from './routes/admin/pricing.js';
import adminContentRoutes from './routes/admin/content.js';

// Public API (for marketing website)
app.use('/api/cms/public/blog', blogRoutes);
app.use('/api/cms/public/pages', pagesRoutes);
app.use('/api/cms/public/pricing', pricingRoutes);
app.use('/api/cms/public/promotions', promotionsRoutes);
app.use('/api/cms/public/testimonials', testimonialsRoutes);
app.use('/api/cms/public/faqs', faqsRoutes);
app.use('/api/cms/public/seo', seoRoutes);

// Admin API (authenticated)
app.use('/api/cms/admin/auth', authRoutes);
app.use('/api/cms/admin/blog', adminBlogRoutes);
app.use('/api/cms/admin/pages', adminPagesRoutes);
app.use('/api/cms/admin/pricing', adminPricingRoutes);
app.use('/api/cms/admin', adminContentRoutes);
app.use('/api/cms/admin/media', mediaRoutes);
app.use('/api/cms/admin/analytics', analyticsRoutes);

// Health check
app.get('/api/cms/health', async (req, res) => {
  try {
    const dbHealth = await dbPool.query('SELECT NOW()');
    const redisHealth = await redisClient.ping();
    const minioHealth = await minioClient.bucketExists(process.env.MINIO_BUCKET || 'marketing-cms');

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth.rows ? 'connected' : 'disconnected',
        redis: redisHealth === 'PONG' ? 'connected' : 'disconnected',
        minio: minioHealth ? 'connected' : 'disconnected',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

// ============================================
// Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// ============================================
// Start Server
// ============================================
async function startServer() {
  try {
    // Test database connection
    await dbPool.query('SELECT NOW()');
    console.log('✅ Database connected');

    // Test Redis connection
    await redisClient.connect();
    console.log('✅ Redis connected');

    // Ensure MinIO bucket exists
    const bucketName = process.env.MINIO_BUCKET || 'marketing-cms';
    const bucketExists = await minioClient.bucketExists(bucketName);
    
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`✅ Created MinIO bucket: ${bucketName}`);
    } else {
      console.log(`✅ MinIO bucket exists: ${bucketName}`);
    }

    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════╗
║   MigraHosting CMS Backend API Ready     ║
╚══════════════════════════════════════════╝

🚀 Server running on: http://localhost:${PORT}
📚 Public API: http://localhost:${PORT}/api/cms/public
🔐 Admin API: http://localhost:${PORT}/api/cms/admin
💚 Health check: http://localhost:${PORT}/api/cms/health

Environment: ${process.env.NODE_ENV || 'development'}
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await redisClient.quit();
  await dbPool.end();
  process.exit(0);
});

startServer();
