import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/client';
import { Award, AlertOctagon } from 'lucide-react';

export default function BloodStorageHistory() {
  const [history, setHistory] = useState({ donations: [], expired: [] });
  const [tab, setTab] = useState('donations');

  const fetchHistory = async () => {
    try {
      const res = await api.get('/admin/blood-storage/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Blood Inventory History & Logs</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Historical audit logs of blood donations and expired units</p>
          </div>
        </header>

        <main className="dashboard-body">
          {/* TAB BUTTONS */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setTab('donations')}
              className={tab === 'donations' ? 'btn-primary' : 'btn-outline'}
            >
              <Award size={16} /> Blood Donation History ({history.donations.length})
            </button>
            <button
              onClick={() => setTab('expired')}
              className={tab === 'expired' ? 'btn-primary' : 'btn-outline'}
            >
              <AlertOctagon size={16} /> Expired Blood Log ({history.expired.length})
            </button>
          </div>

          {tab === 'donations' ? (
            <div className="table-card">
              <div className="table-header">
                <h3>Donation Records & Certificate Registry</h3>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Donor Name</th>
                      <th>Email</th>
                      <th>Blood Group</th>
                      <th>Units</th>
                      <th>Status</th>
                      <th>Certificate ID</th>
                      <th>Donation Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.donations.length > 0 ? (
                      history.donations.map((item) => (
                        <tr key={item._id}>
                          <td><strong>{item.donorName || 'Voluntary Donor'}</strong></td>
                          <td>{item.email}</td>
                          <td><span className="badge badge-blood">{item.blood_group}</span></td>
                          <td>{item.unit} Units</td>
                          <td>
                            <span className={`badge ${item.blood_status === 'stored' ? 'badge-accepted' : 'badge-rejected'}`}>
                              {item.blood_status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {item.certificate_id ? (
                              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0284c7' }}>
                                {item.certificate_id}
                              </span>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td>{new Date(item.donation_date || item.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          No donation records available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="table-card">
              <div className="table-header">
                <h3>Expired Blood Inventory Logs</h3>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Record ID</th>
                      <th>Blood Group</th>
                      <th>Units Expired</th>
                      <th>Logged Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.expired.length > 0 ? (
                      history.expired.map((item) => (
                        <tr key={item._id}>
                          <td><code>{item._id.slice(-6).toUpperCase()}</code></td>
                          <td><span className="badge badge-blood">{item.blood_group}</span></td>
                          <td><strong style={{ color: '#b91c1c' }}>{item.unit} Units</strong></td>
                          <td>{new Date(item.expired_date || item.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          No expired records logged.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
