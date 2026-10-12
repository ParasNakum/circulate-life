import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/client';
import { Trash2 } from 'lucide-react';

export default function AdminRecipients() {
  const [recipients, setRecipients] = useState([]);
  const [search, setSearch] = useState('');

  const fetchRecipients = async () => {
    try {
      const res = await api.get('/admin/recipients');
      setRecipients(res.data);
    } catch (err) {
      console.error('Error fetching recipients:', err);
    }
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipient?')) {
      try {
        await api.delete(`/admin/recipients/${id}`);
        fetchRecipients();
      } catch (err) {
        alert('Failed to delete recipient');
      }
    }
  };

  const filtered = recipients.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Recipients Directory</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Manage registered recipients seeking blood support</p>
          </div>
        </header>

        <main className="dashboard-body">
          <div className="table-card">
            <div className="table-header">
              <div style={{ position: 'relative', width: '300px' }}>
                <input
                  type="text"
                  placeholder="Search recipient name or email..."
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Total: <strong>{filtered.length}</strong> Recipients
              </div>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Pincode</th>
                    <th>Registered On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((recipient) => (
                      <tr key={recipient._id}>
                        <td><strong>{recipient.name}</strong></td>
                        <td>{recipient.email}</td>
                        <td>{recipient.contact || 'N/A'}</td>
                        <td>{recipient.address || 'N/A'}</td>
                        <td>{recipient.pincode || 'N/A'}</td>
                        <td>{new Date(recipient.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(recipient._id)}
                            className="btn-danger"
                            style={{ padding: '5px 8px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No recipients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
