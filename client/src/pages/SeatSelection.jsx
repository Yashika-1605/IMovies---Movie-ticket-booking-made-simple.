import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Film,
  Calendar,
  Clock,
  MapPin,
  Lock,
  ArrowRight,
  AlertCircle,
  Timer,
  CheckCircle,
} from 'lucide-react';
import {
  fetchSeatsForShow,
  toggleSelectSeat,
  clearSelectedSeats,
  updateSeatLocked,
  updateSeatUnlocked,
  updateSeatsBooked,
} from '../store/slices/bookingSlice';
import { getSocket } from '../api/socket';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { seats, selectedSeats, currentShow, loading } = useSelector((state) => state.booking);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [lockExpiresAt, setLockExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Initialize Socket.io connection & room
  useEffect(() => {
    if (!showId) return;

    dispatch(fetchSeatsForShow(showId));
    const socket = getSocket();

    socket.emit('join:show', {
      showId,
      userId: user?._id || user?.id || null,
    });

    // Listen to real-time events
    socket.on('seat:locked', (data) => {
      dispatch(updateSeatLocked(data));
    });

    socket.on('seat:unlocked', (data) => {
      dispatch(updateSeatUnlocked(data));
    });

    socket.on('seat:booked', (data) => {
      dispatch(updateSeatsBooked(data));
    });

    socket.on('seat:lock:failed', (data) => {
      setToast({ message: data.message, type: 'error' });
    });

    return () => {
      socket.emit('leave:show', { showId });
      socket.off('seat:locked');
      socket.off('seat:unlocked');
      socket.off('seat:booked');
      socket.off('seat:lock:failed');
    };
  }, [dispatch, showId, user]);

  // Handle countdown timer when user holds selected locked seats
  useEffect(() => {
    if (selectedSeats.length > 0 && !lockExpiresAt) {
      setLockExpiresAt(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    } else if (selectedSeats.length === 0) {
      setLockExpiresAt(null);
      setTimeLeft(null);
    }
  }, [selectedSeats.length, lockExpiresAt]);

  useEffect(() => {
    if (!lockExpiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((lockExpiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        // Expiry reached
        setToast({ message: 'Seat reservation session timed out. Seats released.', type: 'error' });
        dispatch(clearSelectedSeats());
        dispatch(fetchSeatsForShow(showId));
        setLockExpiresAt(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockExpiresAt, dispatch, showId]);

  // Seat Click Handler
  const handleSeatClick = (seat) => {
    const isSelected = selectedSeats.some((s) => s._id === seat._id);
    const socket = getSocket();
    const currentUserId = user?._id || user?.id || 'guest';

    if (seat.status === 'booked') {
      setToast({ message: `Seat ${seat.seatNumber} is already booked.`, type: 'error' });
      return;
    }

    if (
      seat.status === 'locked' &&
      !isSelected &&
      seat.lockedBy &&
      seat.lockedBy !== currentUserId
    ) {
      setToast({ message: `Seat ${seat.seatNumber} is temporarily reserved by another user.`, type: 'error' });
      return;
    }

    if (isSelected) {
      // User deselects seat
      dispatch(toggleSelectSeat(seat));
      socket.emit('seat:unlock', {
        showId,
        seatId: seat._id,
        userId: currentUserId,
      });
    } else {
      // User selects seat
      if (selectedSeats.length >= 8) {
        setToast({ message: 'Maximum 8 seats allowed per booking transaction.', type: 'info' });
        return;
      }
      dispatch(toggleSelectSeat(seat));
      socket.emit('seat:lock', {
        showId,
        seatId: seat._id,
        userId: currentUserId,
      });
    }
  };

  // Group seats by Rows A, B, C, D, E, F
  const rows = useMemo(() => {
    const rowMap = {};
    seats.forEach((seat) => {
      if (!rowMap[seat.row]) {
        rowMap[seat.row] = [];
      }
      rowMap[seat.row].push(seat);
    });

    // Sort seats in each row by column number
    Object.keys(rowMap).forEach((rowKey) => {
      rowMap[rowKey].sort((a, b) => a.column - b.column);
    });

    return Object.keys(rowMap)
      .sort()
      .map((rowKey) => ({
        row: rowKey,
        seats: rowMap[rowKey],
        tier: rowMap[rowKey][0]?.tier || 'regular',
        price: rowMap[rowKey][0]?.price || 12,
      }));
  }, [seats]);

  // Subtotal Calculation
  const subtotal = selectedSeats.reduce((acc, seat) => acc + (seat.price || 0), 0);

  const formatTimer = (secs) => {
    if (secs === null) return '10:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/seats/${showId}` } });
      return;
    }

    navigate('/checkout');
  };

  const movie = currentShow?.movie || {};
  const theatre = currentShow?.theatre || {};

  return (
    <div style={{ paddingBottom: '7rem' }}>
      {/* Toast Alert */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      {/* Header Info Banner */}
      <div
        style={{
          background: '#111827',
          borderBottom: '1px solid #1e293b',
          padding: '1.25rem 0',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.2rem' }}>
              {movie.title || 'Movie Booking'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: '#94a3b8', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="#e11d48" /> {theatre.name || 'Cinema'} (Screen {currentShow?.screenNumber || 1})
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} color="#10b981" /> {currentShow?.showTime || '07:30 PM'}
              </span>
              <span>•</span>
              <span className="badge badge-crimson" style={{ fontSize: '0.7rem' }}>
                {currentShow?.format || '2D'}
              </span>
            </div>
          </div>

          {/* Real-time Expiry Timer */}
          {timeLeft !== null && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: timeLeft < 60 ? 'rgba(225, 29, 72, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                border: `1px solid ${timeLeft < 60 ? '#e11d48' : '#f59e0b'}`,
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                color: timeLeft < 60 ? '#f43f5e' : '#fbbf24',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              <Timer size={18} />
              <span>Lock Expires In: {formatTimer(timeLeft)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ marginTop: '2.5rem' }}>
        {/* Cinema Curved Screen Visual */}
        <div className="cinema-screen-container">
          <div className="cinema-screen" />
          <span className="screen-label">CINEMA SCREEN (EYE LEVEL)</span>
        </div>

        {/* Legend Indicators */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.75rem',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            fontSize: '0.85rem',
            color: '#cbd5e1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="seat available" style={{ width: '22px', height: '22px', cursor: 'default' }} />
            <span>Available</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="seat selected" style={{ width: '22px', height: '22px', cursor: 'default' }} />
            <span>Selected</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="seat locked" style={{ width: '22px', height: '22px', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={12} color="#fbbf24" />
            </div>
            <span>Reserved</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="seat booked" style={{ width: '22px', height: '22px', cursor: 'default' }} />
            <span>Booked</span>
          </div>
        </div>

        {/* Interactive Seating Matrix */}
        {loading ? (
          <LoadingSpinner message="Connecting to auditorium seat grid..." />
        ) : (
          <div className="seating-matrix">
            {rows.map(({ row, seats: rowSeats, tier, price }) => (
              <div key={row} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '0.4rem' }}>
                {/* Tier Label Banner if first row of tier */}
                {(row === 'A' || row === 'C' || row === 'E') && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: tier === 'vip' ? '#fbbf24' : tier === 'premium' ? '#38bdf8' : '#94a3b8',
                      marginBottom: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span>{tier} SEATS</span>
                    <span style={{ opacity: 0.6 }}>•</span>
                    <span>${price}</span>
                  </div>
                )}

                <div className="seat-row">
                  <div className="row-label">{row}</div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {rowSeats.map((seat, colIndex) => {
                      const isSelected = selectedSeats.some((s) => s._id === seat._id);
                      const isLocked = seat.status === 'locked' && !isSelected;
                      const isBooked = seat.status === 'booked';

                      let seatClass = 'seat available';
                      if (isSelected) seatClass = 'seat selected';
                      else if (isBooked) seatClass = 'seat booked';
                      else if (isLocked) seatClass = 'seat locked';

                      return (
                        <React.Fragment key={seat._id}>
                          {/* Aisle gap between col 5 and col 6 */}
                          {colIndex === 5 && <div className="seat-aisle" />}

                          <button
                            className={seatClass}
                            disabled={isBooked || isLocked}
                            onClick={() => handleSeatClick(seat)}
                            title={`Seat ${seat.seatNumber} (${seat.tier.toUpperCase()} - $${seat.price})`}
                          >
                            {isLocked ? <Lock size={12} color="#fbbf24" /> : seat.column}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="row-label">{row}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Order Summary Bottom Bar */}
      {selectedSeats.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid #334155',
            padding: '1rem 0',
            zIndex: 100,
            boxShadow: '0 -10px 30px rgba(0,0,0,0.6)',
          }}
        >
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  SELECTED SEATS ({selectedSeats.length})
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '3px', flexWrap: 'wrap' }}>
                  {selectedSeats.map((s) => (
                    <span
                      key={s._id}
                      style={{
                        background: '#e11d48',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {s.seatNumber}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderLeft: '1px solid #334155', paddingLeft: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SUBTOTAL</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                  ${subtotal.toFixed(2)}
                </div>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="btn-primary"
              style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
