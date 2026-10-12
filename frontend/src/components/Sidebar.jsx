import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Droplet,
  LayoutDashboard,
  Users,
  Database,
  History,
  GitPullRequest,
  CalendarCheck,
  User,
  LogOut,
  Award
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Droplet size={28} color="#c9182b" fill="#c9182b" />
        <div>
          <strong style={{ fontSize: '1.1rem', color: '#c9182b', display: 'block' }}>Circulate Life</strong>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
            {user.role} Portal
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* ADMIN NAV */}
        {user.role === 'admin' && (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/admin/recipients" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} /> Recipients
            </NavLink>
            <NavLink to="/admin/donors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} /> Donors
            </NavLink>
            <NavLink to="/admin/blood-storage" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Database size={18} /> Blood Storage
            </NavLink>
            <NavLink to="/admin/history" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <History size={18} /> Storage History
            </NavLink>
            <NavLink to="/admin/requests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <GitPullRequest size={18} /> Blood Requests
            </NavLink>
            <NavLink to="/admin/appointments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} /> Appointments
            </NavLink>
            <NavLink to="/admin/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <User size={18} /> My Profile
            </NavLink>
          </>
        )}

        {/* DONOR NAV */}
        {user.role === 'donor' && (
          <>
            <NavLink to="/donor/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/donor/blood-request" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <GitPullRequest size={18} /> Request Blood
            </NavLink>
            <NavLink to="/donor/history" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Award size={18} /> Donation History
            </NavLink>
            <NavLink to="/donor/appointment" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} /> Appointments
            </NavLink>
            <NavLink to="/donor/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <User size={18} /> My Profile
            </NavLink>
          </>
        )}

        {/* RECIPIENT NAV */}
        {user.role === 'recipient' && (
          <>
            <NavLink to="/recipient/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/recipient/blood-request" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <GitPullRequest size={18} /> Request Blood
            </NavLink>
            <NavLink to="/recipient/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <User size={18} /> My Profile
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
          <div style={{ fontWeight: 600 }}>{user.name}</div>
          <div style={{ color: '#64748b', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
        </div>
        <button onClick={handleLogout} className="btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
