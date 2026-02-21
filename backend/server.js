/**
 * server.js - Express app entry point
 * Connects to MongoDB, mounts API routes, configures CORS for frontend.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

// CORS — allow all Vercel URLs and localhost
app.use(cors({
  origin: [
    'https://cine-book-book-your-favourite-movie.vercel.app',
    'https://cine-book-book-your-favour-git-2d4af3-tanmays-projects-431dae7e.vercel.app',
    'https://cine-book-book-your-favourite-movies-q1y1w5ua7.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check
app.get('/', (req, res) => {
  res.send('CineBook Backend is running');
});

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