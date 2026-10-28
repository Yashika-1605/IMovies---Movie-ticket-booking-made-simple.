import React from 'react';
import { Film, Heart, ShieldCheck, Zap, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      className="no-print"
      style={{
        background: '#090d16',
        borderTop: '1px solid #1e293b',
        padding: '3.5rem 0 2rem',
        marginTop: '4rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#e11d48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Film size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                <span style={{ color: '#fff' }}>I</span>
                <span style={{ color: '#e11d48' }}>Movies</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.2rem' }}>
              Cinema management and instant movie ticket booking made simple. Experience seamless seat reservations, real-time sync, and digital ticketing.
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', color: '#64748b', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={16} color="#10b981" /> 100% Secure
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Zap size={16} color="#f59e0b" /> Real-Time Sync
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: '#f8fafc' }}>Explore</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <li><a href="/" style={{ color: 'inherit' }}>Now Showing</a></li>
              <li><a href="/" style={{ color: 'inherit' }}>Upcoming Releases</a></li>
              <li><a href="/" style={{ color: 'inherit' }}>IMAX & 4DX Theatres</a></li>
              <li><a href="/" style={{ color: 'inherit' }}>Exclusive Offers</a></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: '#f8fafc' }}>Tech Stack</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="badge badge-crimson">React.js</span>
              <span className="badge badge-cyan">Node / Express</span>
              <span className="badge badge-emerald">MongoDB Mongoose</span>
              <span className="badge badge-amber">Socket.io</span>
              <span className="badge badge-crimson">Redux Toolkit</span>
              <span className="badge badge-cyan">JWT & Bcrypt</span>
            </div>
          </div>

          {/* Demonstration Notice */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: '#f8fafc' }}>Demo Access</h4>
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid #334155',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: '#fbbf24' }}>Admin:</strong> admin@imovies.com / Admin@123
              </div>
              <div>
                <strong style={{ color: '#34d399' }}>User:</strong> john@example.com / Customer@123
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: '#64748b',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>© {new Date().getFullYear()} IMovies Cinema Management. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Built with <Heart size={14} color="#e11d48" fill="#e11d48" /> by Yashika-1605
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
