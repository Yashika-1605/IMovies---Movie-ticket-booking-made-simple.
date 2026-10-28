import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'rgba(225, 29, 72, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <Film size={36} color="#e11d48" />
      </div>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', color: '#cbd5e1', marginBottom: '1rem' }}>Scene Not Found</h2>
      <p style={{ color: '#94a3b8', maxWidth: '420px', marginBottom: '2rem', fontSize: '0.95rem' }}>
        The reel you are looking for does not exist, has been archived, or was moved to another projector.
      </p>
      <Link to="/" className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
        <Home size={18} /> Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
