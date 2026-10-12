import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/client';
import { Check, X, FileText } from 'lucide-react';

export default function AdminBloodRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching blood requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      await api.post('/admin/requests/handle', { request_id: requestId, action });
      fetchRequests();
    } catch (err) {
      alert('Error updating request status');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Blood Requests Management</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Review and approve emergency blood requisition submissions</p>
          </div>
        </header>

        <main className="dashboard-body">
          <div className="table-card">
            <div className="table-header">
              <h3>All Requisitions ({requests.length})</h3>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Requester</th>
                    <th>Patient</th>
                    <th>Blood Group</th>
                    <th>Units</th>
                    <th>Hospital & Doctor</th>
                    <th>Required When</th>
                    <th>Reason</th>
                    <th>Contact Info</th>
                    <th>Attachment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length > 0 ? (
                    requests.map((req) => (
                      <tr key={req._id}>
                        <td>
                          <strong>{req.username || req.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>({req.userRole})</div>
                        </td>
                        <td>
                          {req.name} ({req.age} yrs, {req.gender || 'N/A'})
                        </td>
                        <td><span className="badge badge-blood">{req.blood_group}</span></td>
                        <td><strong>{req.unit}</strong></td>
                        <td>
                          <div>{req.hospital_name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Dr. {req.doctor_name}</div>
                        </td>
                        <td>{req.when_required}</td>
                        <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {req.reason_for_blood}
                        </td>
                        <td>
                          <div>{req.contact}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{req.email}</div>
                        </td>
                        <td>
                          {req.file_upload ? (
                            <a href={`/uploads/${req.file_upload}`} target="_blank" rel="noreferrer" style={{ color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FileText size={14} /> File
                            </a>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>None</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${req.status === 'Accepted' ? 'badge-accepted' : req.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                            {req.status}
                          </span>
                        </td>
                        <td>
                          {req.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => handleAction(req._id, 'accept')}
                                className="btn-success"
                                style={{ padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Check size={14} /> Accept
                              </button>
                              <button
                                onClick={() => handleAction(req._id, 'reject')}
                                className="btn-danger"
                                style={{ padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <X size={14} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Completed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No blood requests found.
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
