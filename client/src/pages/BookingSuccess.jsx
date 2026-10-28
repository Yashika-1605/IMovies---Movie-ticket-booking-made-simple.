import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckCircle2, Ticket, Printer, ArrowRight, Home } from 'lucide-react';
import TicketModal from '../components/TicketModal';

const BookingSuccess = () => {
  const { currentBooking } = useSelector((state) => state.booking);
  const [showModal, setShowModal] = useState(false);

  if (!currentBooking) {
    return <Navigate to="/" replace />;
  }

  const show = currentBooking.show || {};
  const movie = show.movie || {};
  const theatre = show.theatre || {};

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
        {/* Animated Confirmation Badge */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
          }}
        >
          <CheckCircle2 size={44} color="#10b981" />
        </div>

        <h1 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '0.5rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '2.5rem' }}>
          Your tickets have been reserved and payment processed successfully.
        </p>

        {/* Digital Ticket Card */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            textAlign: 'left',
            marginBottom: '2.5rem',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed #334155', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>BOOKING REFERENCE</span>
              <h3 style={{ fontSize: '1.4rem', color: '#e11d48', fontWeight: 800 }}>
                {currentBooking.bookingId}
              </h3>
            </div>
            <span className="badge badge-emerald">PAID & CONFIRMED</span>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            {movie.posterUrl && (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                style={{ width: '70px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
              />
            )}
            <div>
              <h4 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.25rem' }}>
                {movie.title}
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                {theatre.name} (Screen {show.screenNumber || 1})
              </p>
              <p style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>
                {show.showDate ? new Date(show.showDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'} at {show.showTime}
              </p>
            </div>
          </div>

          {/* Seats Tagged */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111827', padding: '1rem', borderRadius: '10px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>CONFIRMED SEATS</span>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '3px' }}>
                {currentBooking.selectedSeats?.map((s) => (
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
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>AMOUNT PAID</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
                ${currentBooking.totalAmount ? currentBooking.totalAmount.toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{ padding: '0.85rem 1.8rem', fontSize: '0.95rem' }}
          >
            <Printer size={18} /> View & Print Ticket
          </button>

          <Link
            to="/dashboard"
            className="btn-secondary"
            style={{ padding: '0.85rem 1.8rem', fontSize: '0.95rem' }}
          >
            <Ticket size={18} /> View My Bookings
          </Link>

          <Link
            to="/"
            className="btn-outline"
            style={{ padding: '0.85rem 1.8rem', fontSize: '0.95rem' }}
          >
            <Home size={18} /> Back to Movies
          </Link>
        </div>
      </div>

      {/* Ticket Modal */}
      {showModal && (
        <TicketModal booking={currentBooking} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default BookingSuccess;
