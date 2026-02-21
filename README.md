# CineBook – Movie Ticket Booking (MERN)

A full-stack movie ticket booking app (CineBook) built with the MERN stack. Users can browse movies, select showtimes, choose seats, and complete bookings. Admins can manage movies, shows, and view all bookings.

---

## Screenshots

_Add screenshots of Home, Movie Detail, Seat Selection, and Admin Dashboard here after deployment._

---

## Features

### User
- Register and Login with JWT
- Browse all movies on Home page
- View movie details and available showtimes
- Interactive seat map: select seats (green = available, red = booked, yellow = selected)
- Confirm booking (mock pay); seats are marked booked in the database
- View all past bookings on "My Bookings"
- Logout clears token

### Admin
- Login as admin (role stored in DB)
- Admin Dashboard with links to manage movies, shows, and view all bookings
- Add / Edit / Delete movies
- Add / Edit / Delete shows (link to movie, date, time, price, 50 seats per show)
- View all user bookings across the platform

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React (Vite), React Router v6, Axios, Plain CSS |
| Backend  | Node.js, Express.js     |
| Database | MongoDB Atlas, Mongoose |
| Auth     | JWT, bcryptjs           |
| Deploy   | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd movie-booking-app
```

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Environment variables

**Backend** – copy `backend/.env.example` to `backend/.env` and set:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_at_least_32_characters
NODE_ENV=development
```

**Frontend** – copy `frontend/.env.example` to `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
```

### 3. Seed the database

From the `backend` folder:

```bash
npm run seed
```

This creates:
- **Admin:** email `admin@movie.com` / password `admin123`
- **User:** email `user@movie.com` / password `user123`
- 6 movies (Action, Drama, Comedy, Thriller, Sci-Fi, Horror)
- 3 shows per movie with 50 seats each (A1–E10)

### 4. Run the app

**Terminal 1 – Backend:**
```bash
cd backend
npm start
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Use the demo credentials above to login as user or admin.

---

## Deployment

### MongoDB Atlas
1. Create a cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Get the connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority`).
3. Use this as `MONGO_URI` in backend env.

### Backend (Render)
1. Create a new **Web Service**; connect your repo.
2. Root directory: `backend` (or set build command to run from backend).
3. Build command: leave empty or `npm install`.
4. Start command: `npm start`.
5. Environment: add `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`. Optionally `FRONTEND_URL=https://your-vercel-app.vercel.app` for CORS.
6. Deploy and copy the service URL (e.g. `https://your-app.onrender.com`).

### Frontend (Vercel)
1. Import your repo in Vercel; set root to `frontend`.
2. Build command: `npm run build`; output directory: `dist`.
3. Environment: add `VITE_API_URL=https://your-backend.onrender.com` (your Render URL).
4. Deploy. Vercel will use `vercel.json` for SPA routing (all routes → `/`).

### After deployment
- Update backend `FRONTEND_URL` to your Vercel URL so CORS allows the frontend.
- Demo logins remain: `admin@movie.com` / `admin123` and `user@movie.com` / `user123` (run seed once on the deployed DB if needed).

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| **Auth** |
| POST | `/api/auth/register` | Create user | Public |
| POST | `/api/auth/login` | Login, returns JWT | Public |
| **Movies** |
| GET | `/api/movies` | All movies | Public |
| GET | `/api/movies/:id` | Single movie | Public |
| POST | `/api/movies` | Add movie | Admin |
| PUT | `/api/movies/:id` | Update movie | Admin |
| DELETE | `/api/movies/:id` | Delete movie | Admin |
| **Shows** |
| GET | `/api/shows/:movieId` | Shows for movie | Public |
| GET | `/api/shows/detail/:showId` | Show with seat map | Public |
| POST | `/api/shows` | Add show | Admin |
| PUT | `/api/shows/:id` | Update show | Admin |
| DELETE | `/api/shows/:id` | Delete show | Admin |
| **Bookings** |
| POST | `/api/bookings` | Create booking | User |
| GET | `/api/bookings/mine` | My bookings | User |
| GET | `/api/bookings/all` | All bookings | Admin |
| **Health** |
| GET | `/api/health` | Server status | Public |

---

## Demo Login Credentials

| Role  | Email             | Password  |
|-------|-------------------|-----------|
| Admin | admin@movie.com   | admin123  |
| User  | user@movie.com    | user123   |

---

## Folder Structure

```
movie-booking-app/
├── backend/
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # auth, movie, show, booking
│   ├── middleware/            # auth (JWT), admin
│   ├── models/                # User, Movie, Show, Booking
│   ├── routes/                # API routes
│   ├── seed/seedData.js       # Seed script
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Navbar, MovieCard, SeatMap, ProtectedRoute, AdminRoute
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/             # Home, MovieDetail, SeatSelection, etc.
│   │   ├── pages/admin/       # AdminDashboard, ManageMovies, ManageShows, AllBookings
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
└── README.md
```

---

## License


