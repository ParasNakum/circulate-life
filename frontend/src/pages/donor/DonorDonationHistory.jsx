import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Award, Printer, Droplet } from 'lucide-react';

export default function DonorDonationHistory() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get('/donor/donation-history');
        setDonations(res.data);
      } catch (err) {
        console.error('Error fetching donations:', err);
      }
    };
    fetchDonations();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Donation History & Recognition</h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Review your lifesaving contribution records and download certificates</p>
          </div>
        </header>

        <main className="dashboard-body">
          <div className="table-card">
            <div className="table-header">
              <h3>Lifesaving Donations Registry ({donations.length})</h3>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Donation Reference</th>
                    <th>Blood Group</th>
                    <th>Units</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.length > 0 ? (
                    donations.map((item) => (
                      <tr key={item._id}>
                        <td><code>{item._id.slice(-6).toUpperCase()}</code></td>
                        <td><span className="badge badge-blood">{item.blood_group}</span></td>
                        <td><strong>{item.unit} Unit(s)</strong></td>
                        <td>{new Date(item.donation_date || item.createdAt).toLocaleDateString()}</td>
                        <td><span className="badge badge-accepted">VERIFIED</span></td>
                        <td>
                          <button
                            onClick={() => setSelectedCert(item)}
                            className="btn-primary"
                            style={{ padding: '5px 12px', fontSize: '0.85rem' }}
                          >
                            <Award size={14} /> Certificate
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No donations recorded yet. Schedule an appointment to make your first donation!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PRINTABLE DIGITAL CERTIFICATE MODAL */}
          {selectedCert && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '680px' }}>
                <div className="modal-header">
                  <h3>Donation Certificate</h3>
                  <button onClick={() => setSelectedCert(null)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
                </div>
                <div className="modal-body">
                  <div style={{
                    border: '8px double #c9182b',
                    padding: '2.5rem',
                    textAlign: 'center',
                    background: '#fffdfd',
                    borderRadius: '8px'
                  }}>
                    <Droplet size={48} color="#c9182b" fill="#c9182b" style={{ margin: '0 auto 1rem auto' }} />
                    <h2 style={{ color: '#c9182b', fontSize: '1.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Certificate of Appreciation
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                      This certificate is proudly awarded to
                    </p>
                    <h1 style={{ fontSize: '2.2rem', color: '#1e293b', borderBottom: '2px solid #e2e8f0', display: 'inline-block', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                      {user?.name || selectedCert.donorName}
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
                      In sincere recognition of your voluntary donation of <strong>{selectedCert.unit} Unit(s)</strong> of <strong>{selectedCert.blood_group}</strong> blood. Your selfless contribution has helped sustain lives in our medical care network.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#64748b' }}>
                      <div>
                        <strong>Date:</strong> {new Date(selectedCert.donation_date || selectedCert.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Certificate ID:</strong> {selectedCert.certificate_id || 'CERT-' + selectedCert._id.slice(-6).toUpperCase()}
                      </div>
                      <div>
                        <strong>Circulate Life</strong> Blood Bank
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={() => setSelectedCert(null)} className="btn-outline">Close</button>
                  <button onClick={handlePrint} className="btn-primary">
                    <Printer size={16} /> Print Certificate
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
