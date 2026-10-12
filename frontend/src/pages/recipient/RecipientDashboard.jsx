import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { GitPullRequest, CheckCircle2, Clock, Plus, ArrowRight } from 'lucide-react';

export default function RecipientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    requestCount: 0,
    approvedCount: 0,
    pendingCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/recipient/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching recipient stats:', err);
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
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Recipient Dashboard</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Welcome, {user?.name} | Emergency Blood Requisition Desk</p>
          </div>
          <Link to="/recipient/blood-request" className="btn-primary">
            <Plus size={18} /> Request Blood Now
          </Link>
        </header>

        <main className="dashboard-body">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple"><GitPullRequest size={26} /></div>
              <div className="stat-info">
                <h3>{stats.requestCount}</h3>
                <p>Total Requests Filed</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green"><CheckCircle2 size={26} /></div>
              <div className="stat-info">
                <h3>{stats.approvedCount}</h3>
                <p>Approved Requisitions</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue"><Clock size={26} /></div>
              <div className="stat-info">
                <h3>{stats.pendingCount}</h3>
                <p>Pending Review</p>
              </div>
            </div>
          </div>

          <div className="table-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '1rem' }}>Emergency Blood Support</h2>
            <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Circulate Life operates 24/7 to connect registered patients and hospitals directly with verified blood storage inventory. If you need blood for an urgent surgery or medical therapy, submit a requisition form with your prescription.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/recipient/blood-request" className="btn-primary">
                Submit New Blood Requisition <ArrowRight size={16} />
              </Link>
              <Link to="/recipient/profile" className="btn-outline">
                Update Contact Information
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
