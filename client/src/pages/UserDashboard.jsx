import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Printer,
  XCircle,
  AlertTriangle,
  User,
  ShieldCheck,
} from 'lucide-react';
import { fetchMyBookings, cancelUserBooking } from '../store/slices/bookingSlice';
import TicketModal from '../components/TicketModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myBookings, loading } = useSelector((state) => state.booking);

  const [activeTab, setActiveTab] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? A 90% refund will be credited.')) {
      return;
    }

    setCancellingBookingId(bookingId);
    try {
      const result = await dispatch(cancelUserBooking(bookingId));
      if (cancelUserBooking.fulfilled.match(result)) {
        setToast({ message: 'Booking cancelled successfully. Refund processed.', type: 'success' });
      } else {
        setToast({ message: result.payload || 'Failed to cancel booking', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error processing cancellation', type: 'error' });
    } finally {
      setCancellingBookingId(null);
    }
  };

  const filteredBookings = myBookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'confirmed') return b.bookingStatus === 'confirmed';
    if (activeTab === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      <div className="container">
        {/* User Profile Header Card */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: user?.role === 'admin' ? '#f59e0b' : '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.8rem',
                fontWeight: 800,
                boxShadow: '0 4px 20px rgba(225, 29, 72, 0.4)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{ fontSize: '1.6rem', color: '#fff' }}>{user?.name}</h1>
                <span className={user?.role === 'admin' ? 'badge badge-amber' : 'badge badge-crimson'}>
                  {user?.role === 'admin' ? 'Admin' : 'Member'}
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '2px' }}>{user?.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', textAlign: 'right' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>TOTAL BOOKINGS</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                {myBookings.length}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>STATUS</span>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <ShieldCheck size={16} /> Verified
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Bookings Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.2rem' }}>
              My Ticket Bookings
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              View your upcoming show tickets, download printable passes, or manage cancellations.
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', background: '#111827', padding: '0.3rem', borderRadius: '10px' }}>
            {['all', 'confirmed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  background: activeTab === tab ? '#1e293b' : 'transparent',
                  color: activeTab === tab ? '#fff' : '#94a3b8',
                  transition: 'all 0.2s',
                }}
              >
                {tab === 'all' ? 'All Tickets' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <LoadingSpinner message="Fetching your booking records..." />
        ) : filteredBookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredBookings.map((booking) => {
              const show = booking.show || {};
              const movie = show.movie || {};
              const theatre = show.theatre || {};
              const isCancelled = booking.bookingStatus === 'cancelled';

              return (
                <div
                  key={booking._id}
                  className="glass-panel"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    opacity: isCancelled ? 0.75 : 1,
                  }}
                >
                  {/* Left: Poster + Movie Details */}
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', minWidth: '280px' }}>
                    {movie.posterUrl && (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        style={{ width: '64px', height: '90px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                          {booking.bookingId}
                        </span>
                        <span
                          className={isCancelled ? 'badge badge-crimson' : 'badge badge-emerald'}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {isCancelled ? 'CANCELLED' : 'CONFIRMED'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.25rem' }}>
                        {movie.title || 'Movie Title'}
                      </h3>

                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} color="#e11d48" /> {theatre.name || 'Multiplex'} (Screen {show.screenNumber || 1})
                      </p>
                    </div>
                  </div>

                  {/* Middle: Showtime & Seats */}
                  <div style={{ fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      <Calendar size={15} color="#38bdf8" />
                      <span>
                        {show.showDate ? new Date(show.showDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
                      </span>
                      <span>•</span>
                      <Clock size={15} color="#10b981" />
                      <strong style={{ color: '#fff' }}>{show.showTime || '07:30 PM'}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>SEATS:</span>
                      {booking.selectedSeats?.map((s) => (
                        <span
                          key={s.seatId || s.seatNumber}
                          style={{
                            background: '#111827',
                            border: '1px solid #334155',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: '#e11d48',
                          }}
                        >
                          {s.seatNumber}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Price & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>TOTAL AMOUNT</span>
                      <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
                        ${booking.totalAmount ? booking.totalAmount.toFixed(2) : '0.00'}
                      </p>
                      {isCancelled && booking.refundAmount > 0 && (
                        <span style={{ fontSize: '0.75rem', color: '#34d399' }}>
                          Refund: ${booking.refundAmount.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setSelectedTicket(booking)}
                        className="btn-primary"
                        style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                      >
                        <Printer size={15} /> View Ticket
                      </button>

                      {!isCancelled && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancellingBookingId === booking._id}
                          className="btn-secondary"
                          style={{
                            padding: '0.55rem 1rem',
                            fontSize: '0.85rem',
                            color: '#f87171',
                            borderColor: 'rgba(239, 68, 68, 0.3)',
                          }}
                        >
                          <XCircle size={15} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              background: '#1e293b',
              borderRadius: '16px',
              border: '1px dashed #334155',
            }}
          >
            <Ticket size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.4rem' }}>
              No Bookings Found
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You haven't booked any movies in this category yet.
            </p>
            <a href="/" className="btn-primary">
              Browse Movies Now
            </a>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal booking={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
};

export default UserDashboard;
