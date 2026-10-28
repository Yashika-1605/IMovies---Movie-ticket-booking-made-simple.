import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Film,
  MapPin,
  User as UserIcon,
  Ticket,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { fetchCities, setSelectedCity } from '../store/slices/theatreSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cities, selectedCity } = useSelector((state) => state.theatres);
  const { selectedSeats } = useSelector((state) => state.booking);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleCityChange = (e) => {
    dispatch(setSelectedCity(e.target.value));
  };

  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)',
            }}
          >
            <Film size={22} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            <span style={{ color: '#fff' }}>I</span>
            <span style={{ color: '#e11d48' }}>Movies</span>
          </span>
        </Link>

        {/* City Filter & Navigation Links (Desktop) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="no-print">
          {/* City Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(30, 41, 59, 0.7)',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <MapPin size={16} color="#e11d48" />
            <select
              value={selectedCity}
              onChange={handleCityChange}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <option value="All" style={{ background: '#1e293b' }}>
                All Cities
              </option>
              {cities.map((city) => (
                <option key={city} value={city} style={{ background: '#1e293b' }}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 500, fontSize: '0.95rem' }}>
            <Link to="/" style={{ color: '#f8fafc', transition: 'color 0.2s' }}>
              Movies
            </Link>
            <Link to="/#theatres" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>
              Theatres
            </Link>
          </nav>
        </div>

        {/* User / Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="no-print">
          {/* Selected Seats Indicator */}
          {selectedSeats.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(225, 29, 72, 0.15)',
                border: '1px solid rgba(225, 29, 72, 0.4)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                color: '#f43f5e',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <Ticket size={16} />
              <span>{selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}</span>
            </div>
          )}

          {isAuthenticated && user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.4rem 0.8rem',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: user.role === 'admin' ? '#f59e0b' : '#e11d48',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '210px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    padding: '0.5rem',
                    zIndex: 200,
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #334155' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {user.email}
                    </p>
                    {user.role === 'admin' && (
                      <span className="badge badge-amber" style={{ marginTop: '0.3rem', fontSize: '0.65rem' }}>
                        Admin Role
                      </span>
                    )}
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                    }}
                  >
                    <Ticket size={16} color="#e11d48" />
                    <span>My Bookings</span>
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '6px',
                        color: '#fbbf24',
                        fontSize: '0.85rem',
                      }}
                    >
                      <Shield size={16} />
                      <span>Admin Console</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '6px',
                      color: '#f87171',
                      fontSize: '0.85rem',
                      textAlign: 'left',
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
