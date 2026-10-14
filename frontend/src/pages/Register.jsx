import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Droplet, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const [userType, setUserType] = useState('donor');
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    dob: '',
    age: '',
    body_weight: '',
    blood_group: 'O+',
    gender: 'Male',
    address: '',
    pincode: '',
    contact: ''
  });
  const [fileUpload, setFileUpload] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFileUpload(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('fullname', formData.fullname);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', userType);
      data.append('contact', formData.contact);
      data.append('address', formData.address);
      data.append('pincode', formData.pincode);

      if (userType === 'donor') {
        data.append('dob', formData.dob);
        data.append('age', formData.age);
        data.append('body_weight', formData.body_weight);
        data.append('blood_group', formData.blood_group);
        data.append('gender', formData.gender);
        if (fileUpload) {
          data.append('file_upload', fileUpload);
        }
      }

      const res = await api.post('/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(serverMsg || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ padding: '3rem 1rem' }}>
      <div className="auth-card" style={{ maxWidth: '640px' }}>
        <div className="auth-header">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#c9182b', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            <Droplet size={36} color="#c9182b" fill="#c9182b" />
            <span>Circulate Life</span>
          </Link>
          <h2 style={{ fontSize: '1.4rem', color: '#1e293b' }}>Join the Network</h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Register as a voluntary donor or recipient seeking blood</p>
        </div>

        {/* ROLE SELECTOR TABS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: '#f1f5f9', padding: '4px', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setUserType('donor')}
            style={{
              padding: '0.6rem',
              borderRadius: '6px',
              border: 'none',
              background: userType === 'donor' ? '#ffffff' : 'transparent',
              color: userType === 'donor' ? '#c9182b' : '#64748b',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: userType === 'donor' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            🩸 Register as Donor
          </button>
          <button
            type="button"
            onClick={() => setUserType('recipient')}
            style={{
              padding: '0.6rem',
              borderRadius: '6px',
              border: 'none',
              background: userType === 'recipient' ? '#ffffff' : 'transparent',
              color: userType === 'recipient' ? '#c9182b' : '#64748b',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: userType === 'recipient' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            🏥 Register as Recipient
          </button>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullname"
                required
                className="form-control"
                placeholder="Paras Nakum"
                value={formData.fullname}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                required
                className="form-control"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                name="contact"
                required
                className="form-control"
                placeholder="9712583381"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* DONOR SPECIFIC FIELDS */}
          {userType === 'donor' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label>Blood Group *</label>
                  <select
                    name="blood_group"
                    className="form-control"
                    value={formData.blood_group}
                    onChange={handleChange}
                    required
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    className="form-control"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    className="form-control"
                    placeholder="24"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Body Weight (kg)</label>
                  <input
                    type="text"
                    name="body_weight"
                    className="form-control"
                    placeholder="65 kg"
                    value={formData.body_weight}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    className="form-control"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Medical Report / ID Upload (Optional)</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
            </>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder="Street, City, State"
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
                placeholder="395002"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '1rem', marginTop: '1rem' }}
          >
            {loading ? 'Creating Account...' : `Register as ${userType === 'donor' ? 'Donor' : 'Recipient'}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#c9182b', fontWeight: 600 }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
