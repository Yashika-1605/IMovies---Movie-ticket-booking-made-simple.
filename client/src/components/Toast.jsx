import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColors = {
    success: 'rgba(16, 185, 129, 0.95)',
    error: 'rgba(225, 29, 72, 0.95)',
    info: 'rgba(30, 41, 59, 0.95)',
  };

  const icons = {
    success: <CheckCircle2 size={18} color="#fff" />,
    error: <AlertCircle size={18} color="#fff" />,
    info: <Info size={18} color="#38bdf8" />,
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        background: bgColors[type] || bgColors.info,
        backdropFilter: 'blur(10px)',
        color: '#ffffff',
        padding: '0.85rem 1.25rem',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.9rem',
        fontWeight: 500,
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      {icons[type]}
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ color: '#fff', opacity: 0.8, cursor: 'pointer' }}>
        <X size={16} />
      </button>
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
