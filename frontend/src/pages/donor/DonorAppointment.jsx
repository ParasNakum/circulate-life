import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Calendar, Clock, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export default function DonorAppointment() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    blood_group: user?.blood_group || 'O+',
    date: '',
    time: '10:00 AM'
  });

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/donor/my-appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/donor/appointment', formData);
      setMessage('Appointment booked successfully!');
      setShowModal(false);
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Error booking appointment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Cancel this scheduled appointment?')) {
      try {
        await api.delete(`/donor/appointments/${id}`);
        fetchAppointments();
      } catch (err) {
        alert('Error cancelling appointment');
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Blood Donation Appointments</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Schedule voluntary donation slots at your nearest Circulate Life center</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={18} /> Schedule Appointment
          </button>
        </header>

        <main className="dashboard-body">
          {message && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} /> {message}
            </div>
          )}

          <div className="table-card">
            <div className="table-header">
              <h3>My Scheduled Appointments ({appointments.length})</h3>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Appointment Reference</th>
                    <th>Blood Group</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((item) => (
                      <tr key={item._id}>
                        <td><code>{item._id.slice(-6).toUpperCase()}</code></td>
                        <td><span className="badge badge-blood">{item.blood_group}</span></td>
                        <td><strong>{item.date}</strong></td>
                        <td>{item.time}</td>
                        <td>
                          <span className={`badge ${item.status === 'Accepted' ? 'badge-accepted' : item.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          {item.status === 'Pending' && (
                            <button onClick={() => handleDelete(item._id)} className="btn-danger" style={{ padding: '4px 8px' }}>
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No appointments scheduled yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SCHEDULE MODAL */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Book Donation Appointment</h3>
                  <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {error && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        {error}
                      </div>
                    )}
                    <div className="form-group">
                      <label>Blood Group</label>
                      <select
                        className="form-control"
                        value={formData.blood_group}
                        onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Preferred Date *</label>
                      <input
                        type="date"
                        required
                        className="form-control"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Preferred Time Slot *</label>
                      <select
                        className="form-control"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      >
                        <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                        <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                        <option value="11:30 AM">11:30 AM - 12:30 PM</option>
                        <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                        <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                    <button type="submit" className="btn-primary">Confirm Booking</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
