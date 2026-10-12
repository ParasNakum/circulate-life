import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { User, CheckCircle, AlertCircle } from 'lucide-react';

export default function DonorProfile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    contact: user?.contact || '',
    address: user?.address || '',
    pincode: user?.pincode || '',
    currentPassword: '',
    newPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await api.put('/auth/update-profile', {
        name: formData.name,
        contact: formData.contact,
        address: formData.address,
        pincode: formData.pincode,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined
      });
      updateUser(res.data.user);
      setMessage('Donor profile updated successfully!');
      setFormData({ ...formData, currentPassword: '', newPassword: '' });
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
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Donor Profile Details</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Manage your personal, contact, and security settings</p>
          </div>
        </header>

        <main className="dashboard-body">
          <div className="auth-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    className="form-control"
                    value={user?.email || ''}
                    style={{ background: '#f8fafc', color: '#94a3b8' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Blood Group</label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={user?.blood_group || 'O+'}
                    style={{ background: '#f8fafc', color: '#94a3b8' }}
                  />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    name="contact"
                    className="form-control"
                    value={formData.contact}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    className="form-control"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr style={{ margin: '1.5rem 0', borderColor: '#e2e8f0' }} />
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#1e293b' }}>Security & Password</h4>

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  placeholder="Enter current password to make changes"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                Save Profile Changes
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
