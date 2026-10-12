import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Droplet, CalendarCheck, Award, GitPullRequest, ArrowRight } from 'lucide-react';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    requestCount: 0,
    appointmentCount: 0,
    donationCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/donor/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching donor stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Donor Dashboard</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Welcome, {user?.name} | Blood Group: <strong style={{ color: '#c9182b' }}>{user?.blood_group || 'O+'}</strong></p>
          </div>
          <Link to="/donor/appointment" className="btn-primary">
            <CalendarCheck size={18} /> Book Appointment
          </Link>
        </header>

        <main className="dashboard-body">
          {/* STATS OVERVIEW */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon red"><Award size={26} /></div>
              <div className="stat-info">
                <h3>{stats.donationCount}</h3>
                <p>Completed Donations</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue"><CalendarCheck size={26} /></div>
              <div className="stat-info">
                <h3>{stats.appointmentCount}</h3>
                <p>Scheduled Appointments</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple"><GitPullRequest size={26} /></div>
              <div className="stat-info">
                <h3>{stats.requestCount}</h3>
                <p>Blood Requisitions</p>
              </div>
            </div>
          </div>

          {/* DONOR EDUCATION AND INFORMATION CARDS (Recreating images from PHP donor_dashboard) */}
          <div className="table-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '1rem' }}>Guidelines After Blood Donation</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Thank you for being a lifesaver! Here are vital tips to recover quickly and stay energized after your blood donation:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <img src="/assets/images/slider/donor1.jpg" alt="Donor Care" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Stay Hydrated & Rest</h4>
                  <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Drink plenty of fluids over the next 24-48 hours. Avoid strenuous exercise or heavy lifting for the rest of the day.</p>
                </div>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <img src="/assets/images/slider/donor2.jpg" alt="Healthy Diet" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Iron-Rich Meals</h4>
                  <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Eat nutritious, iron-rich foods such as spinach, legumes, and lean protein to help replenish red blood cell production.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <Link to="/donor/history" className="btn-outline">
                View My Donation Certificates <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
