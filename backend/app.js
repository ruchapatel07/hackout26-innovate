import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import producerRoutes from './routes/producerRoutes.js';
import consumerRoutes from './routes/consumerRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import logisticsRoutes from './routes/logisticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { errorHandler } from './middleware/error.js';
import { seedInitialData } from './utils/seedData.js';
import { createAwsDynamoDBTables } from './utils/createAwsTables.js';

const app = express();

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Auto-provision AWS DynamoDB tables & seed data asynchronously on server boot
(async () => {
  try {
    await createAwsDynamoDBTables();
    await seedInitialData();
  } catch (err) {
    console.error('[Boot Setup Error]', err.message);
  }
})();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'CarbonLink AI Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/producer', producerRoutes);
app.use('/api/consumer', consumerRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Middleware
app.use(errorHandler);

export default app;
