import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Plus, Trash2, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function RecipientBloodRequest() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    blood_group: 'B+',
    reason_for_blood: '',
    when_required: 'Immediate',
    unit: 1,
    hospital_name: '',
    doctor_name: '',
    gender: 'Male',
    address: user?.address || '',
    pincode: user?.pincode || '',
    contact: user?.contact || ''
  });
  const [fileUpload, setFileUpload] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/recipient/my-requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching recipient requests:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (fileUpload) {
        data.append('file_upload', fileUpload);
      }

      await api.post('/recipient/request-blood', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Blood requisition submitted successfully!');
      setShowModal(false);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting requisition');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this requisition?')) {
      try {
        await api.delete(`/recipient/requests/${id}`);
        fetchRequests();
      } catch (err) {
        alert('Error cancelling requisition');
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Blood Requisitions</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Submit medical requisitions and check approval from Circulate Life blood bank</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={18} /> Submit New Requisition
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
              <h3>My Requisition History ({requests.length})</h3>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Blood Group</th>
                    <th>Units</th>
                    <th>When Required</th>
                    <th>Hospital & Doctor</th>
                    <th>Reason</th>
                    <th>Attachment</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length > 0 ? (
                    requests.map((item) => (
                      <tr key={item._id}>
                        <td><strong>{item.name}</strong> ({item.age} yrs)</td>
                        <td><span className="badge badge-blood">{item.blood_group}</span></td>
                        <td><strong>{item.unit}</strong></td>
                        <td>{item.when_required}</td>
                        <td>
                          <div>{item.hospital_name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Dr. {item.doctor_name}</div>
                        </td>
                        <td>{item.reason_for_blood}</td>
                        <td>
                          {item.file_upload ? (
                            <a href={`/uploads/${item.file_upload}`} target="_blank" rel="noreferrer" style={{ color: '#0284c7' }}>
                              <FileText size={16} />
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
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
                      <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No blood requisitions found. Click "Submit New Requisition" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* REQUEST MODAL */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '650px' }}>
                <div className="modal-header">
                  <h3>Hospital Blood Requisition Form</h3>
                  <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {error && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        {error}
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Patient Full Name *</label>
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
                        <label>Age *</label>
                        <input
                          type="number"
                          name="age"
                          required
                          className="form-control"
                          value={formData.age}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Blood Group *</label>
                        <select
                          name="blood_group"
                          className="form-control"
                          value={formData.blood_group}
                          onChange={handleChange}
                        >
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Units *</label>
                        <input
                          type="number"
                          name="unit"
                          min="1"
                          required
                          className="form-control"
                          value={formData.unit}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>When Required *</label>
                        <input
                          type="text"
                          name="when_required"
                          placeholder="Immediate / Date"
                          required
                          className="form-control"
                          value={formData.when_required}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Hospital Name *</label>
                        <input
                          type="text"
                          name="hospital_name"
                          required
                          className="form-control"
                          value={formData.hospital_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Doctor Name *</label>
                        <input
                          type="text"
                          name="doctor_name"
                          required
                          className="form-control"
                          value={formData.doctor_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Diagnosis / Reason for Blood *</label>
                      <input
                        type="text"
                        name="reason_for_blood"
                        placeholder="e.g. Surgery, Severe Anemia, Accident"
                        required
                        className="form-control"
                        value={formData.reason_for_blood}
                        onChange={handleChange}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Contact Phone *</label>
                        <input
                          type="text"
                          name="contact"
                          required
                          className="form-control"
                          value={formData.contact}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Doctor Slip / Report</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => setFileUpload(e.target.files[0])}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                    <button type="submit" className="btn-primary">Submit Requisition</button>
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
