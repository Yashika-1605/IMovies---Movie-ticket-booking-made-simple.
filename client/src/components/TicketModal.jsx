import React from 'react';
import { X, Printer, Film, Calendar, Clock, MapPin, CheckCircle, QrCode } from 'lucide-react';

const TicketModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const show = booking.show || {};
  const movie = show.movie || {};
  const theatre = show.theatre || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#1e293b',
          borderRadius: '20px',
          border: '1px solid #475569',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #334155',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Film size={20} color="#e11d48" />
            <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Digital Cinema Ticket</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              borderRadius: '50%',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Printable Ticket Body */}
        <div style={{ padding: '2rem' }}>
          <div className="ticket-container">
            {/* Top Brand & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  <span style={{ color: '#fff' }}>I</span>
                  <span style={{ color: '#e11d48' }}>Movies</span>
                </span>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                  Booking ID: <strong style={{ color: '#f8fafc' }}>{booking.bookingId}</strong>
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  className={booking.bookingStatus === 'confirmed' ? 'badge badge-emerald' : 'badge badge-crimson'}
                >
                  {booking.bookingStatus === 'confirmed' ? 'CONFIRMED' : 'CANCELLED'}
                </span>
              </div>
            </div>

            {/* Movie Info */}
            <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              {movie.posterUrl && (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  style={{ width: '64px', height: '90px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <div>
                <h4 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.25rem' }}>
                  {movie.title || 'Movie Title'}
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                  <span className="badge badge-crimson" style={{ fontSize: '0.65rem' }}>
                    {show.format || '2D'}
                  </span>
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                    {movie.language || 'English'}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Runtime: {movie.duration || 120} mins
                </p>
              </div>
            </div>

            {/* Theatre & Showtime Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
              }}
            >
              <div>
                <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> Cinema
                </span>
                <p style={{ fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
                  {theatre.name || 'Multiplex Cinema'}
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                  {theatre.location?.city || ''} (Screen {show.screenNumber || 1})
                </p>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} /> Date & Showtime
                </span>
                <p style={{ fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
                  {show.showDate ? new Date(show.showDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
                </p>
                <p style={{ color: '#e11d48', fontWeight: 600, fontSize: '0.85rem' }}>
                  {show.showTime || '07:30 PM'}
                </p>
              </div>
            </div>

            {/* Seats & Payment */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed #475569', paddingTop: '1.2rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SEATS ALLOCATED</span>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '4px', flexWrap: 'wrap' }}>
                  {booking.selectedSeats?.map((s) => (
                    <span
                      key={s.seatId || s.seatNumber}
                      style={{
                        background: '#e11d48',
                        color: '#fff',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                      }}
                    >
                      {s.seatNumber}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>TOTAL PAID</span>
                <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
                  ${booking.totalAmount ? booking.totalAmount.toFixed(2) : '0.00'}
                </p>
              </div>
            </div>

            {/* QR Code Simulation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', background: '#fff', padding: '0.75rem', borderRadius: '8px', color: '#000' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <QrCode size={36} color="#000" />
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700 }}>SCAN AT GATE ENTRANCE</p>
                  <p style={{ fontSize: '0.65rem', color: '#666' }}>Valid only with government photo ID</p>
                </div>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700 }}>
                {booking.paymentTransactionId || 'TXN-99482'}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            background: 'rgba(15, 23, 42, 0.8)',
            borderTop: '1px solid #334155',
          }}
        >
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
            Close
          </button>
          <button onClick={handlePrint} className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
            <Printer size={16} /> Print / Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
