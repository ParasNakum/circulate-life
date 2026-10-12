import React from 'react';
import { Droplet, Heart, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#1e293b', color: '#cbd5e1', paddingTop: '3.5rem', paddingBottom: '1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
            <Droplet size={28} color="#ef4444" fill="#ef4444" /> Circulate Life
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: '#94a3b8' }}>
            Dedicated to saving lives by bridging blood donors with recipients and healthcare providers. Certified, real-time inventory and seamless donor appointment booking.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.1rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2', fontSize: '0.92rem' }}>
            <li><a href="#about" style={{ color: '#cbd5e1' }}>About Blood Donation</a></li>
            <li><a href="#types" style={{ color: '#cbd5e1' }}>Types of Donation</a></li>
            <li><a href="#process" style={{ color: '#cbd5e1' }}>Donation Process</a></li>
            <li><a href="/login" style={{ color: '#cbd5e1' }}>Donor / Recipient Portal</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.1rem' }}>Contact Info</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#ef4444" /> Surat, Gujarat, India
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} color="#ef4444" /> +91 9712583381
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={18} color="#ef4444" /> circulatelife021@gmail.com
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #334155', marginTop: '3rem', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        © {new Date().getFullYear()} Circulate Life Blood Bank System. Developed by Paras Nakum. All rights reserved.
      </div>
    </footer>
  );
}
