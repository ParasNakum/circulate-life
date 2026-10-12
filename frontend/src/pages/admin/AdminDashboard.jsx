import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/client';
import { Users, Droplet, UserCheck, GitPullRequest, CalendarCheck, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    recipient_count: 0,
    donor_count: 0,
    total_user_count: 0,
    total_requests: 0,
    pending_requests: 0,
    appointments_count: 0,
    total_units: 0,
    storage: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
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
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Admin Dashboard</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Welcome to Circulate Life Administration Portal</p>
          </div>
          <div className="badge badge-accepted">System Online</div>
        </header>

        <main className="dashboard-body">
          {/* STATS OVERVIEW CARDS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue"><Users size={26} /></div>
              <div className="stat-info">
                <h3>{stats.recipient_count}</h3>
                <p>Recipients</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon red"><Droplet size={26} /></div>
              <div className="stat-info">
                <h3>{stats.donor_count}</h3>
                <p>Voluntary Donors</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green"><UserCheck size={26} /></div>
              <div className="stat-info">
                <h3>{stats.total_user_count}</h3>
                <p>Total Registered Users</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple"><Activity size={26} /></div>
              <div className="stat-info">
                <h3>{stats.total_units}</h3>
                <p>Total Blood Units in Stock</p>
              </div>
            </div>
          </div>

          {/* SECOND ROW STATS */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="stat-card">
              <div className="stat-icon red"><GitPullRequest size={24} /></div>
              <div className="stat-info">
                <h3>{stats.total_requests}</h3>
                <p>Total Blood Requests</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue"><GitPullRequest size={24} /></div>
              <div className="stat-info">
                <h3>{stats.pending_requests}</h3>
                <p>Pending Requests</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green"><CalendarCheck size={24} /></div>
              <div className="stat-info">
                <h3>{stats.appointments_count}</h3>
                <p>Total Appointments</p>
              </div>
            </div>
          </div>

          {/* BLOOD STORAGE SUMMARY CARD */}
          <div className="table-card">
            <div className="table-header">
              <h3 style={{ fontSize: '1.15rem' }}>Current Blood Inventory Status</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div className="blood-grid">
                {stats.storage.map((item) => (
                  <div key={item._id} className="blood-card">
                    <div className="blood-badge-large">{item.blood_group}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b' }}>{item.unit} Units</div>
                    <span className="badge badge-blood" style={{ marginTop: '0.5rem' }}>
                      {item.unit > 5 ? 'In Stock' : 'Low Stock'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
