/**
 * AdminDashboard.jsx - Admin home with links to manage movies, shows, bookings
 */

import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="page admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-links">
        <Link to="/admin/movies" className="admin-card">
          <h2>Manage Movies</h2>
          <p>Add, edit, delete movies</p>
        </Link>
        <Link to="/admin/shows" className="admin-card">
          <h2>Manage Shows</h2>
          <p>Add, edit, delete showtimes</p>
        </Link>
        <Link to="/admin/bookings" className="admin-card">
          <h2>All Bookings</h2>
          <p>View all user bookings</p>
        </Link>
      </div>
    </div>
  );
}
