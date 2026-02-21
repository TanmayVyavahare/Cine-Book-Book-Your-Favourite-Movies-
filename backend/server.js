/**
 * server.js - Express app entry point
 * Connects to MongoDB, mounts API routes, configures CORS for frontend.
 */

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

connectDB();

const app = express();

// Body parser
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// CORS: allow frontend origin (VITE_API_URL in prod, or * in dev)
const isDev = process.env.NODE_ENV !== 'production';
const allowedOrigin = process.env.FRONTEND_URL || process.env.VITE_API_URL;
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (isDev) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else if (allowedOrigin && origin === allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health check for Render/deployment
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
