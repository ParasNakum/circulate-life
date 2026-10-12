import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/client';
import { Check, X, Calendar } from 'lucide-react';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/admin/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAction = async (appointmentId, action) => {
    try {
      await api.post('/admin/appointments/handle', { appointment_id: appointmentId, action });
      fetchAppointments();
    } catch (err) {
      alert('Error updating appointment');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Donor Appointments</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Manage and confirm appointments booked by voluntary blood donors</p>
          </div>
        </header>

        <main className="dashboard-body">
          <div className="table-card">
            <div className="table-header">
              <h3>Appointment Schedule ({appointments.length})</h3>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Appointment ID</th>
                    <th>Donor Email</th>
                    <th>Blood Group</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((apt) => (
                      <tr key={apt._id}>
                        <td><code>{apt._id.slice(-6).toUpperCase()}</code></td>
                        <td>{apt.email}</td>
                        <td><span className="badge badge-blood">{apt.blood_group}</span></td>
                        <td><strong>{apt.date}</strong></td>
                        <td>{apt.time}</td>
                        <td>
                          <span className={`badge ${apt.status === 'Accepted' ? 'badge-accepted' : apt.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td>
                          {apt.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => handleAction(apt._id, 'accept')}
                                className="btn-success"
                                style={{ padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Check size={14} /> Accept
                              </button>
                              <button
                                onClick={() => handleAction(apt._id, 'reject')}
                                className="btn-danger"
                                style={{ padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <X size={14} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Decision finalized</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No appointments booked.
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
