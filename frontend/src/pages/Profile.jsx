/**
 * Profile.jsx - User profile: avatar, name, email, Member Since, role, stats, recent bookings, edit form
 * Protected route. Fetches bookings for stats and recent list.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getMyBookings,
  updateProfile,
  updatePassword,
} from '../services/api';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getMyBookings();
        setBookings(data);
      } catch (err) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const totalBookings = bookings.length;
  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const recentBookings = bookings.slice(0, 3);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setSavingProfile(true);
    try {
      const { data } = await updateProfile(name);
      updateUser({ name: data.name });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });
    if (!currentPassword || !newPassword) {
      setPasswordMsg({ type: 'error', text: 'Fill current and new password.' });
      return;
    }
    setSavingPassword(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setPasswordMsg({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setSavingPassword(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="page profile-page">
      <h1>My Profile</h1>

      <div className="profile-header">
        <div className="profile-avatar" aria-hidden="true">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-meta">Member since {memberSince}</p>
          <span className="profile-role-badge">{user?.role === 'admin' ? 'Admin' : 'User'}</span>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat-value">{totalBookings}</span>
          <span className="profile-stat-label">Total Bookings</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">₹{totalSpent}</span>
          <span className="profile-stat-label">Total Spent</span>
        </div>
      </div>

      <section className="profile-recent">
        <h3>Recent Bookings</h3>
        {loading ? (
          <p className="text-secondary">Loading...</p>
        ) : recentBookings.length === 0 ? (
          <p className="text-secondary">No bookings yet.</p>
        ) : (
          <ul className="profile-recent-list">
            {recentBookings.map((b) => (
              <li key={b._id}>
                {b.show?.movie?.title} — {b.show?.date} {b.show?.time} — Seats: {b.seats?.join(', ')} — ₹{b.totalPrice}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="profile-edit">
        <h3>Edit Profile</h3>
        <form onSubmit={handleSaveProfile} className="profile-form">
          {profileMsg.text && (
            <p className={profileMsg.type === 'success' ? 'msg-success' : 'msg-error'}>{profileMsg.text}</p>
          )}
          <label htmlFor="profile-name">Full Name</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Name'}
          </button>
        </form>
      </section>

      <section className="profile-password">
        <h3>Change Password</h3>
        <form onSubmit={handleSavePassword} className="profile-form">
          {passwordMsg.text && (
            <p className={passwordMsg.type === 'success' ? 'msg-success' : 'msg-error'}>{passwordMsg.text}</p>
          )}
          <label htmlFor="current-password">Current Password</label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />
          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
          />
          <button type="submit" className="btn btn-primary" disabled={savingPassword}>
            {savingPassword ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      </section>
    </div>
  );
}
