import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { connectDB, isDbConnected } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';
import { verifySmtpConnection } from './services/emailService.js';
import productRoutes from './routes/productRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import wholesaleRoutes from './routes/wholesaleRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { getCategories } from './controllers/productController.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API with MongoDB and Email service status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'NATCHIYAR CRACKERS API Server',
    database: isDbConnected() ? 'CONNECTED (MongoDB)' : 'DISCONNECTED (In-memory fallback)',
    emailService: config.smtp.user ? `CONFIGURED (${config.smtp.user})` : 'NOT_CONFIGURED',
    location: config.store.city,
    time: new Date().toISOString()
  });
});

// Category Route Alias
app.get('/api/categories', getCategories);

// Mount API routes
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/wholesale-enquiries', wholesaleRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = config.port;

// Connect to MongoDB, check SMTP, and start server
const startServer = async () => {
  await connectDB();
  await seedDatabase();
  await verifySmtpConnection();

  app.listen(PORT, () => {
    console.log(`🎆 NATCHIYAR CRACKERS API running on port ${PORT} [${config.nodeEnv}]`);
    console.log(`🍃 Database Status: ${isDbConnected() ? 'Connected to MongoDB' : 'In-memory fallback'}`);
    console.log(`📧 Email SMTP: ${config.smtp.user}`);
    console.log(`📍 Sivakasi Headquarters: +91 ${config.store.phone}`);
  });
};

startServer();

export default app;
