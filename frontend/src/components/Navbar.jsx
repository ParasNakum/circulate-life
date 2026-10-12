import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, User, LogIn, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'donor') return '/donor/dashboard';
    return '/recipient/dashboard';
  };

  return (
    <header className="public-navbar">
      <div className="top-bar">
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>📧 circulatelife021@gmail.com</span>
          <span>⏰ Service Time: 24/7 Available</span>
        </div>
        <div>
          {user ? (
            <Link to={getDashboardPath()} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={15} /> Welcome, {user.name} ({user.role})
            </Link>
          ) : (
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LogIn size={15} /> Login / Register
            </Link>
          )}
        </div>
      </div>

      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <Droplet size={32} color="#c9182b" fill="#c9182b" />
          <span>Circulate Life</span>
        </Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#types">Donation Types</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#contact">Contact</a></li>
          {user ? (
            <li>
              <Link to={getDashboardPath()} className="btn-primary">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/login" className="btn-primary">
                <LogIn size={18} /> Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
