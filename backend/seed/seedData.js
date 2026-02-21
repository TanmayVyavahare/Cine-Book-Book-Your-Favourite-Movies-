/**
 * seedData.js - Seed DB with admin, user, movies, and shows
 * Run: npm run seed (from backend directory)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

// Build 50 seats: A1–A10, B1–B10, ... E10
function buildSeats() {
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seats = [];
  for (const row of rows) {
    for (let num = 1; num <= 10; num++) {
      seats.push({ seatNumber: `${row}${num}`, isBooked: false });
    }
  }
  return seats;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding.');

    // Clear existing data
    await Booking.deleteMany({});
    await Show.deleteMany({});
    await Movie.deleteMany({});
    await User.deleteMany({});

    // Create admin and user
    await User.create({ name: 'Admin', email: 'admin@movie.com', password: 'admin123', role: 'admin' });
    await User.create({ name: 'Test User', email: 'user@movie.com', password: 'user123', role: 'user' });
    console.log('Users created: admin@movie.com, user@movie.com');

    // 6 movies with real TMDB posters
    const moviesData = [
      {
        title: 'Dhurandhar',
        description: "A mysterious traveler slips into the heart of Karachi's underbelly and rises through its ranks with lethal precision, only to tear the notorious ISI-Underworld nexus apart from within",
        genre: 'Action',
        duration: 152,
        rating: 9,
        language: 'Hindi',
        releaseDate: new Date('2008-07-18'),
        poster: 'https://imgs.search.brave.com/6bAqsr2rTY8IYYPMQxF6QJWStbo6tNORGyQmGD8WVpA/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5p/bXBhd2FyZHMuY29t/L2ludGwvaW5kaWEv/MjAyNS9wb3N0ZXJz/L2RodXJhbmRoYXIu/anBn'
      },
      {
        title: 'The Dark Knight',
        description: 'Batman faces the Joker in Gotham. A gripping tale of chaos and heroism.',
        genre: 'Action',
        duration: 152,
        rating: 9,
        language: 'English',
        releaseDate: new Date('2008-07-18'),
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
      },
      {
        title: 'Forrest Gump',
        description: 'Life is like a box of chocolates. An uplifting journey through decades of American history.',
        genre: 'Drama',
        duration: 142,
        rating: 8,
        language: 'English',
        releaseDate: new Date('1994-07-06'),
        poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg'
      },
      {
        title: 'Superbad',
        description: 'Two friends plan one big party before college. Hilarious high school comedy.',
        genre: 'Comedy',
        duration: 113,
        rating: 7,
        language: 'English',
        releaseDate: new Date('2007-08-17'),
        poster: 'https://imgs.search.brave.com/NuU_AwEqK4lcvie3JNM1r6aM7VVPvFlMky1bjqXqVPI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk5qazBNemRs/WkdFdE5UUmtPQzAw/WkRSaUxXSmtZakF0/TXpVellUUmlOemsx/WVRWaVhrRXlYa0Zx/Y0djQC5qcGc'
      },
      {
        title: 'Shutter Island',
        description: 'A marshal investigates a psychiatric facility on a remote island. Mind-bending thriller.',
        genre: 'Thriller',
        duration: 138,
        rating: 8,
        language: 'English',
        releaseDate: new Date('2010-02-19'),
        poster: 'https://imgs.search.brave.com/XPYo5cJ4A5UCT1_zfZfuhFNanKPu1f7agi6K75qg6Co/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwLnNyY2RuLmNv/bS93b3JkcHJlc3Mv/d3AtY29udGVudC91/cGxvYWRzLzIwMjAv/MDYvU2h1dHRlci1J/c2xhbmQtTW92aWUt/UG9zdGVyLmpwZz9x/PTQ5JmZpdD1jb250/YWluJnc9NDgwJmRw/cj0y'
      },
      {
        title: 'Interstellar',
        description: 'Explorers travel through a wormhole in search of a new home for humanity.',
        genre: 'Sci-Fi',
        duration: 169,
        rating: 9,
        language: 'English',
        releaseDate: new Date('2014-11-07'),
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
      },
      {
        title: 'The Conjuring',
        description: 'Paranormal investigators help a family terrorized by a dark presence. Based on true events.',
        genre: 'Horror',
        duration: 112,
        rating: 7,
        language: 'English',
        releaseDate: new Date('2013-07-19'),
        poster: 'https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg'
      },
    ];

    const movies = await Movie.insertMany(moviesData);
    console.log('Movies created:', movies.length);

    // 5 dates × 6 time slots = 30 shows per movie, 50 seats each
    const showDates = ['2025-03-25', '2025-03-26', '2025-03-27', '2025-03-28', '2025-03-29'];
    const showTimes = ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '9:30 PM', '11:55 PM'];

    for (const movie of movies) {
      for (const date of showDates) {
        for (let t = 0; t < showTimes.length; t++) {
          await Show.create({
            movie: movie._id,
            date,
            time: showTimes[t],
            price: 250 + t * 25,
            seats: buildSeats(),
          });
        }
      }
    }
    const totalShows = movies.length * showDates.length * showTimes.length;
    console.log(`Shows created: ${totalShows} total (30 per movie).`);
    console.log('Seed completed successfully.');
    process.exit(0);

  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();