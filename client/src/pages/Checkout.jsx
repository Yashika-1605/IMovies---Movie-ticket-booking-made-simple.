import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CreditCard,
  ShieldCheck,
  Tag,
  CheckCircle,
  AlertCircle,
  Lock,
  Calendar,
  Clock,
  MapPin,
  Film,
  ArrowLeft,
  Smartphone,
  Building,
} from 'lucide-react';
import { confirmBooking } from '../store/slices/bookingSlice';
import Toast from '../components/Toast';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentShow, selectedSeats, loading } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Payment form mock fields
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardName: user?.name || 'John Doe',
    expiry: '12/28',
    cvv: '888',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // If no seats selected or show info is missing, redirect to home
  if (!currentShow || !selectedSeats || selectedSeats.length === 0) {
    return <Navigate to="/" replace />;
  }

  const movie = currentShow.movie || {};
  const theatre = currentShow.theatre || {};

  const subtotal = selectedSeats.reduce((acc, s) => acc + (s.price || 0), 0);
  const convenienceFee = 2.5;
  const total = Math.max(0, subtotal + convenienceFee - appliedDiscount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'IMOVIES20') {
      const discountVal = parseFloat((subtotal * 0.2).toFixed(2));
      setAppliedDiscount(discountVal);
      setCouponApplied(true);
      setToast({ message: 'Promo code applied! 20% discount granted.', type: 'success' });
    } else {
      setToast({ message: 'Invalid promo code. Try "IMOVIES20" for 20% off!', type: 'error' });
    }
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const resultAction = await dispatch(
        confirmBooking({
          showId: currentShow._id,
          seatIds: selectedSeats.map((s) => s._id),
          paymentMethod: paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking',
          couponCode: couponApplied ? 'IMOVIES20' : '',
        })
      );

      if (confirmBooking.fulfilled.match(resultAction)) {
        navigate('/booking-success');
      } else {
        setToast({ message: resultAction.payload || 'Booking could not be completed.', type: 'error' });
        setIsProcessing(false);
      }
    } catch (err) {
      setToast({ message: 'Payment gateway error. Please try again.', type: 'error' });
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      <div className="container">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#94a3b8',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Back to Seat Selection
        </button>

        <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '2rem' }}>
          Secure Checkout & Payment
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'flex-start' }}>
          {/* Left Column: Payment Methods & Customer Info */}
          <div>
            {/* Customer Details */}
            <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="#10b981" />
                Customer Contact Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>NAME</span>
                  <p style={{ color: '#f8fafc', fontWeight: 600 }}>{user?.name || 'Customer'}</p>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>EMAIL</span>
                  <p style={{ color: '#f8fafc', fontWeight: 600 }}>{user?.email || 'customer@example.com'}</p>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>PHONE</span>
                  <p style={{ color: '#f8fafc', fontWeight: 600 }}>{user?.phone || '+1 (555) 019-2834'}</p>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="#e11d48" />
                Select Payment Method
              </h3>

              {/* Method Selector Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.75rem' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    padding: '0.8rem 0.5rem',
                    borderRadius: '10px',
                    background: paymentMethod === 'card' ? 'rgba(225, 29, 72, 0.15)' : '#111827',
                    border: `1px solid ${paymentMethod === 'card' ? '#e11d48' : '#334155'}`,
                    color: paymentMethod === 'card' ? '#f43f5e' : '#94a3b8',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                  }}
                >
                  <CreditCard size={18} />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  style={{
                    padding: '0.8rem 0.5rem',
                    borderRadius: '10px',
                    background: paymentMethod === 'upi' ? 'rgba(225, 29, 72, 0.15)' : '#111827',
                    border: `1px solid ${paymentMethod === 'upi' ? '#e11d48' : '#334155'}`,
                    color: paymentMethod === 'upi' ? '#f43f5e' : '#94a3b8',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                  }}
                >
                  <Smartphone size={18} />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  style={{
                    padding: '0.8rem 0.5rem',
                    borderRadius: '10px',
                    background: paymentMethod === 'netbanking' ? 'rgba(225, 29, 72, 0.15)' : '#111827',
                    border: `1px solid ${paymentMethod === 'netbanking' ? '#e11d48' : '#334155'}`,
                    color: paymentMethod === 'netbanking' ? '#f43f5e' : '#94a3b8',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                  }}
                >
                  <Building size={18} />
                  <span>Net Banking</span>
                </button>
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div>
                  <div className="input-group">
                    <label className="input-label">Card Number</label>
                    <input
                      type="text"
                      className="input-field"
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Cardholder Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={cardData.cardName}
                      onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div className="input-group">
                      <label className="input-label">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        className="input-field"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">CVV</label>
                      <input
                        type="password"
                        className="input-field"
                        value={cardData.cvv}
                        maxLength={4}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '10px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                  <Smartphone size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ color: '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>Instant UPI Checkout</p>
                  <p>QR code and dynamic UPI intent will be simulated upon confirmation.</p>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '10px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                  <Building size={32} color="#38bdf8" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ color: '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>Direct Bank Transfer</p>
                  <p>Supports all major international and national banking gateways.</p>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="btn-primary"
                style={{ width: '100%', marginTop: '1.5rem', padding: '0.9rem 0', fontSize: '1.05rem' }}
              >
                {isProcessing ? (
                  <span>Processing Mock Gateway...</span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lock size={16} /> Pay ${total.toFixed(2)} & Confirm Tickets
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.25rem' }}>
                Booking Summary
              </h3>

              {/* Movie Mini Header */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #334155' }}>
                {movie.posterUrl && (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    style={{ width: '56px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                )}
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.25rem' }}>
                    {movie.title}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={13} color="#e11d48" /> {theatre.name}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                    <Clock size={13} color="#10b981" /> {currentShow.showTime} ({currentShow.format || '2D'})
                  </p>
                </div>
              </div>

              {/* Seats Breakdown */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>SEATS ({selectedSeats.length})</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                  {selectedSeats.map((s) => (
                    <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#cbd5e1' }}>
                        Seat <strong style={{ color: '#fff' }}>{s.seatNumber}</strong> ({s.tier})
                      </span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>${s.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', margin: '1.5rem 0', padding: '1rem 0', borderTop: '1px solid #334155', borderBottom: '1px solid #334155' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Enter code (e.g. IMOVIES20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="input-field"
                    style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                    disabled={couponApplied}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-secondary"
                  disabled={couponApplied || !couponCode}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Apply
                </button>
              </form>

              {/* Pricing Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#fff' }}>${subtotal.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Convenience Fee</span>
                  <span style={{ color: '#fff' }}>${convenienceFee.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                    <span>Promo Discount (20%)</span>
                    <span>-${appliedDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '0.8rem', marginTop: '0.4rem', fontSize: '1.25rem', fontWeight: 800 }}>
                  <span style={{ color: '#fff' }}>Total Amount</span>
                  <span style={{ color: '#10b981' }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
