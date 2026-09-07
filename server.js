import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Apex Digital Marketplace & Internship Portal API',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/orders', orderRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Apex Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
