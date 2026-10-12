import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/client';
import { Plus, Minus, Edit, AlertTriangle } from 'lucide-react';

export default function BloodStorage() {
  const [storage, setStorage] = useState([]);
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [expireModal, setExpireModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Forms
  const [addForm, setAddForm] = useState({ donor_email: '', blood_group: 'O+', unit: 1 });
  const [removeForm, setRemoveForm] = useState({ blood_group: 'O+', unit: 1 });
  const [expireForm, setExpireForm] = useState({ blood_group: 'O+', unit: 1 });
  const [editUnits, setEditUnits] = useState(0);

  const fetchStorage = async () => {
    try {
      const res = await api.get('/admin/blood-storage');
      setStorage(res.data);
    } catch (err) {
      console.error('Error fetching blood storage:', err);
    }
  };

  useEffect(() => {
    fetchStorage();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/blood-storage/add', addForm);
      setAddModal(false);
      setAddForm({ donor_email: '', blood_group: 'O+', unit: 1 });
      fetchStorage();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding blood entry');
    }
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/blood-storage/remove', removeForm);
      setRemoveModal(false);
      fetchStorage();
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing blood entry');
    }
  };

  const handleExpire = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/blood-storage/add-expired', expireForm);
      setExpireModal(false);
      fetchStorage();
    } catch (err) {
      alert(err.response?.data?.message || 'Error recording expired blood');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/blood-storage/${editItem._id}`, { unit: editUnits });
      setEditItem(null);
      fetchStorage();
    } catch (err) {
      alert('Error updating blood units');
    }
  };

  const filtered = storage.filter((item) =>
    item.blood_group.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Blood Storage Inventory</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Monitor, add, adjust and log blood reserve units</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setAddModal(true)} className="btn-primary">
              <Plus size={16} /> Add Blood Entry
            </button>
            <button onClick={() => setRemoveModal(true)} className="btn-outline">
              <Minus size={16} /> Remove Blood
            </button>
            <button onClick={() => setExpireModal(true)} style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.45rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} /> Log Expired
            </button>
          </div>
        </header>

        <main className="dashboard-body">
          <div className="table-card">
            <div className="table-header">
              <input
                type="text"
                placeholder="Search Blood Group (e.g. A+, O-)..."
                className="form-control"
                style={{ width: '280px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Storage ID</th>
                    <th>Blood Group</th>
                    <th>Units Available</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row._id}>
                      <td><code>{row._id.slice(-6).toUpperCase()}</code></td>
                      <td>
                        <span className="blood-badge-large" style={{ width: '40px', height: '40px', fontSize: '1rem', display: 'inline-flex', margin: 0 }}>
                          {row.blood_group}
                        </span>
                      </td>
                      <td><strong style={{ fontSize: '1.1rem' }}>{row.unit}</strong> Units</td>
                      <td>
                        <span className={`badge ${row.unit > 10 ? 'badge-accepted' : row.unit > 3 ? 'badge-pending' : 'badge-rejected'}`}>
                          {row.unit > 10 ? 'Adequate' : row.unit > 3 ? 'Moderate' : 'Critical Low'}
                        </span>
                      </td>
                      <td>{new Date(row.updatedAt || row.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => { setEditItem(row); setEditUnits(row.unit); }}
                          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
                        >
                          <Edit size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ADD MODAL */}
          {addModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Add Blood Entry</h3>
                  <button onClick={() => setAddModal(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
                </div>
                <form onSubmit={handleAdd}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Donor Email</label>
                      <input
                        type="email"
                        required
                        className="form-control"
                        placeholder="donor@example.com"
                        value={addForm.donor_email}
                        onChange={(e) => setAddForm({ ...addForm, donor_email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Blood Type</label>
                      <select
                        className="form-control"
                        value={addForm.blood_group}
                        onChange={(e) => setAddForm({ ...addForm, blood_group: e.target.value })}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Units</label>
                      <input
                        type="number"
                        min="1"
                        required
                        className="form-control"
                        value={addForm.unit}
                        onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" onClick={() => setAddModal(false)} className="btn-outline">Cancel</button>
                    <button type="submit" className="btn-primary">Add Entry</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* REMOVE MODAL */}
          {removeModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Remove Blood Entry</h3>
                  <button onClick={() => setRemoveModal(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
                </div>
                <form onSubmit={handleRemove}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Blood Type</label>
                      <select
                        className="form-control"
                        value={removeForm.blood_group}
                        onChange={(e) => setRemoveForm({ ...removeForm, blood_group: e.target.value })}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Units to Remove</label>
                      <input
                        type="number"
                        min="1"
                        required
                        className="form-control"
                        value={removeForm.unit}
                        onChange={(e) => setRemoveForm({ ...removeForm, unit: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" onClick={() => setRemoveModal(false)} className="btn-outline">Cancel</button>
                    <button type="submit" className="btn-danger">Remove</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* EXPIRE MODAL */}
          {expireModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Record Expired Blood</h3>
                  <button onClick={() => setExpireModal(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
                </div>
                <form onSubmit={handleExpire}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Blood Type</label>
                      <select
                        className="form-control"
                        value={expireForm.blood_group}
                        onChange={(e) => setExpireForm({ ...expireForm, blood_group: e.target.value })}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Expired Units</label>
                      <input
                        type="number"
                        min="1"
                        required
                        className="form-control"
                        value={expireForm.unit}
                        onChange={(e) => setExpireForm({ ...expireForm, unit: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" onClick={() => setExpireModal(false)} className="btn-outline">Cancel</button>
                    <button type="submit" className="btn-danger">Log Expired</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* EDIT UNITS MODAL */}
          {editItem && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Edit Storage: {editItem.blood_group}</h3>
                  <button onClick={() => setEditItem(null)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
                </div>
                <form onSubmit={handleEdit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Current Units</label>
                      <input
                        type="number"
                        min="0"
                        required
                        className="form-control"
                        value={editUnits}
                        onChange={(e) => setEditUnits(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" onClick={() => setEditItem(null)} className="btn-outline">Cancel</button>
                    <button type="submit" className="btn-primary">Save Changes</button>
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
