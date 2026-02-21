/**
 * api.js - All Axios API calls in one place
 * Base URL from VITE_API_URL. Token attached for protected routes.
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('movie_booking_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const updateProfile = (name) =>
  api.put('/auth/profile', { name });

export const updatePassword = (currentPassword, newPassword) =>
  api.put('/auth/password', { currentPassword, newPassword });

// Movies
export const getMovies = () => api.get('/movies');
export const getMovieById = (id) => api.get(`/movies/${id}`);

// Shows
export const getShowsByMovieId = (movieId) => api.get(`/shows/${movieId}`);
export const getShowById = (showId) => api.get(`/shows/detail/${showId}`);

// Bookings (protected)
export const createBooking = (showId, seats) =>
  api.post('/bookings', { showId, seats });
export const getMyBookings = () => api.get('/bookings/mine');

// Payments (Razorpay, protected)
export const createOrder = (amount) =>
  api.post('/payments/create-order', { amount });
export const verifyPayment = (data) =>
  api.post('/payments/verify', data);

// Admin - Movies
export const createMovie = (data) => api.post('/movies', data);
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);

// Admin - Shows
export const createShow = (data) => api.post('/shows', data);
export const updateShow = (id, data) => api.put(`/shows/${id}`, data);
export const deleteShow = (id) => api.delete(`/shows/${id}`);

// Admin - All bookings
export const getAllBookings = () => api.get('/bookings/all');

// Health
export const healthCheck = () => api.get('/health');

export default api;
