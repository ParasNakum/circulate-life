import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { User, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminProfile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await api.put('/auth/update-profile', {
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });
      updateUser(res.data.user);
      setMessage('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Administrator Profile</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Manage account settings and administrator credentials</p>
          </div>
        </header>

        <main className="dashboard-body">
          <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {message && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} /> {message}
              </div>
            )}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Admin Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Admin Email</label>
                <input
                  type="email"
                  disabled
                  className="form-control"
                  value={user?.email || ''}
                  style={{ background: '#f8fafc', color: '#94a3b8' }}
                />
              </div>

              <hr style={{ margin: '1.5rem 0', borderColor: '#e2e8f0' }} />
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#1e293b' }}>Change Password (Optional)</h4>

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                Update Administrator Profile
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
