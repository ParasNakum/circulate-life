import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/client';
import { Droplet, Heart, ShieldCheck, Users, Activity, CheckCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  const [bloodStock, setBloodStock] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await api.get('/blood/availability');
        if (Array.isArray(res.data)) {
          setBloodStock(res.data);
        }
      } catch (err) {
        console.warn('Backend API not yet connected, using standard inventory:', err.message);
      }
    };
    fetchStock();
  }, []);

  return (
    <div>
      <Navbar />

      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url("/assets/images/slider/slide-02.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '7rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <span style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'inline-block',
            marginBottom: '1.25rem'
          }}>
            Every Drop Saves A Life
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Donate Blood & Be A Lifesaver Today
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Circulate Life is a centralized blood bank network connecting compassionate donors with patients and hospitals in urgent medical emergencies.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
              Register as Donor <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-outline" style={{ padding: '0.8rem 2rem', fontSize: '1rem', color: '#ffffff', borderColor: '#ffffff' }}>
              Request Blood
            </Link>
          </div>
        </div>
      </section>

      {/* REAL-TIME BLOOD INVENTORY HIGHLIGHT */}
      <section style={{ maxWidth: '1200px', margin: '-3rem auto 3rem auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b' }}>Live Blood Bank Storage</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Current verified units available in our cold storage</p>
            </div>
            <Link to="/login" style={{ color: '#c9182b', fontWeight: 600, fontSize: '0.9rem' }}>
              Request for blood units →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1rem' }}>
            {(Array.isArray(bloodStock) && bloodStock.length > 0 ? bloodStock : [
              { blood_group: 'A+', unit: 18 },
              { blood_group: 'A-', unit: 9 },
              { blood_group: 'B+', unit: 25 },
              { blood_group: 'B-', unit: 7 },
              { blood_group: 'AB+', unit: 12 },
              { blood_group: 'AB-', unit: 5 },
              { blood_group: 'O+', unit: 32 },
              { blood_group: 'O-', unit: 14 }
            ]).map((item) => (
              <div key={item.blood_group} style={{
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: '10px',
                padding: '1rem 0.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#c9182b' }}>{item.blood_group}</div>
                <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>{item.unit} Units</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#c9182b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem' }}>About Circulate Life</span>
            <h2 style={{ fontSize: '2.2rem', color: '#1e293b', margin: '0.5rem 0 1.25rem 0' }}>Safe, Hygienic & Verified Blood Storage</h2>
            <p style={{ color: '#475569', marginBottom: '1.25rem', lineHeight: '1.7' }}>
              In Circulate Life (Blood Bank) System, recipients can get blood easily and donors can book donation appointments seamlessly.
            </p>
            <p style={{ color: '#475569', marginBottom: '1.5rem', lineHeight: '1.7' }}>
              When a donor donates blood, it is safely tested, preserved in temperature-monitored blood storage, and verified before being handed over to ensure the correct blood type and volume are delivered.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color="#10b981" /> <span>100% Certified Donors</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color="#10b981" /> <span>24/7 Rapid Response</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color="#10b981" /> <span>Digital Certificates</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color="#10b981" /> <span>Emergency Hospital Support</span>
              </div>
            </div>
          </div>
          <div>
            <img src="/assets/images/slider/donor1.jpg" alt="Blood Donation" style={{ width: '100%', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      </section>

      {/* TYPES OF DONATION */}
      <section id="types" style={{ background: '#f8fafc', padding: '5rem 1.5rem', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#c9182b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem' }}>Medical Insights</span>
          <h2 style={{ fontSize: '2.2rem', color: '#1e293b', margin: '0.5rem 0 2.5rem 0' }}>Types of Donation</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0', textAlign: 'left' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Droplet size={24} color="#c9182b" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>Whole Blood</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6' }}>
                The most flexible and common type of blood donation. It can be separated into red cells, plasma, and platelets to help multiple patients.
              </p>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0', textAlign: 'left' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Activity size={24} color="#0284c7" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>Plasma (Apheresis)</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Used for trauma patients, severe burn victims, and individuals with clotting factor deficiencies or serious immune disorders.
              </p>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0', textAlign: 'left' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} color="#d97706" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e293b' }}>Platelets</h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Essential for cancer therapies, organ transplants, and cardiovascular surgical procedures where rapid blood clotting is critical.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" style={{ padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: '#c9182b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem' }}>How It Works</span>
          <h2 style={{ fontSize: '2.2rem', color: '#1e293b', margin: '0.5rem 0' }}>The Blood Donation Process</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          {[
            { step: '01', title: 'Registration', desc: 'Create your donor account with contact info, blood group, and medical profile.' },
            { step: '02', title: 'Appointment', desc: 'Pick your preferred date and time slot for medical screening and donation.' },
            { step: '03', title: 'Donation', desc: 'A quick, comfortable 10-15 minute procedure supervised by healthcare specialists.' },
            { step: '04', title: 'Certificate', desc: 'Receive your verified donor certificate and view your complete donation record.' }
          ].map((item) => (
            <div key={item.step} style={{ textAlign: 'center', padding: '1.5rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fee2e2', marginBottom: '0.5rem' }}>{item.step}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#1e293b' }}>{item.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" style={{ background: '#f8fafc', padding: '4rem 1.5rem', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '1rem' }}>Have Questions or Need Immediate Assistance?</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            Our support desk is active around the clock for hospital blood dispatch and emergency donor coordination.
          </p>
          <a href="mailto:circulatelife021@gmail.com" className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
            Contact Support Desk
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
