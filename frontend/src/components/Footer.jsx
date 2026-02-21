/**
 * Footer.jsx - Dark footer with app name, tagline, Built with MERN Stack
 */

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Link to="/" className="footer-brand">Cine<span>Book</span></Link>
        <p className="footer-tagline">Book movie tickets in a few clicks.</p>
        <p className="footer-stack">Built with MERN Stack</p>
      </div>
    </footer>
  );
}
