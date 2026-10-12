import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/client';
import { Search, Trash2, Eye } from 'lucide-react';

export default function AdminDonors() {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDonor, setSelectedDonor] = useState(null);

  const fetchDonors = async () => {
    try {
      const res = await api.get('/admin/donors');
      setDonors(res.data);
    } catch (err) {
      console.error('Error fetching donors:', err);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        await api.delete(`/admin/donors/${id}`);
        fetchDonors();
      } catch (err) {
        alert('Failed to delete donor');
      }
    }
  };

  const filtered = donors.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.blood_group?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Donors Directory</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>View registered voluntary blood donors</p>
          </div>
        </header>

        <main className="dashboard-body">
          <div className="table-card">
            <div className="table-header">
              <div style={{ position: 'relative', width: '300px' }}>
                <input
                  type="text"
                  placeholder="Search donor name, email or blood..."
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Total: <strong>{filtered.length}</strong> Donors
              </div>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Blood Group</th>
                    <th>Contact</th>
                    <th>Weight</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((donor) => (
                      <tr key={donor._id}>
                        <td><strong>{donor.name}</strong></td>
                        <td>{donor.email}</td>
                        <td><span className="badge badge-blood">{donor.blood_group}</span></td>
                        <td>{donor.contact || 'N/A'}</td>
                        <td>{donor.body_weight || 'N/A'}</td>
                        <td>{donor.address ? `${donor.address} (${donor.pincode})` : 'N/A'}</td>
                        <td>
                          <button
                            onClick={() => setSelectedDonor(donor)}
                            style={{ background: '#e0f2fe', color: '#0284c7', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(donor._id)}
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
                        No donors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* VIEW DONOR MODAL */}
          {selectedDonor && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Donor Profile: {selectedDonor.name}</h3>
                  <button onClick={() => setSelectedDonor(null)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
                </div>
                <div className="modal-body">
                  <p><strong>Email:</strong> {selectedDonor.email}</p>
                  <p><strong>Blood Group:</strong> {selectedDonor.blood_group}</p>
                  <p><strong>Date of Birth:</strong> {selectedDonor.dob || 'N/A'} (Age: {selectedDonor.age})</p>
                  <p><strong>Gender:</strong> {selectedDonor.gender || 'N/A'}</p>
                  <p><strong>Body Weight:</strong> {selectedDonor.body_weight || 'N/A'}</p>
                  <p><strong>Contact:</strong> {selectedDonor.contact || 'N/A'}</p>
                  <p><strong>Address:</strong> {selectedDonor.address || 'N/A'}</p>
                  <p><strong>Pincode:</strong> {selectedDonor.pincode || 'N/A'}</p>
                  {selectedDonor.file_upload && (
                    <p style={{ marginTop: '10px' }}>
                      <strong>Uploaded Document:</strong>{' '}
                      <a href={`/uploads/${selectedDonor.file_upload}`} target="_blank" rel="noreferrer" style={{ color: '#0284c7', textDecoration: 'underline' }}>
                        View Attachment
                      </a>
                    </p>
                  )}
                </div>
                <div className="modal-footer">
                  <button onClick={() => setSelectedDonor(null)} className="btn-primary">Close</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
