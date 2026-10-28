import React, { useEffect, useState } from 'react';
import {
  Film,
  Building,
  Calendar,
  Ticket,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Users,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Modals state
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showTheatreModal, setShowTheatreModal] = useState(false);
  const [showShowModal, setShowShowModal] = useState(false);

  // New Movie Form
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 150,
    releaseDate: new Date().toISOString().split('T')[0],
    posterUrl: '',
    trailerUrl: '',
    rating: 8.5,
    director: '',
    cast: '',
  });

  // New Theatre Form
  const [theatreForm, setTheatreForm] = useState({
    name: '',
    city: 'New York',
    address: '',
    state: 'NY',
    screens: 4,
    facilities: 'Dolby Atmos, IMAX, Recliner Seats',
  });

  // New Show Form
  const [showForm, setShowForm] = useState({
    movieId: '',
    theatreId: '',
    screenNumber: 1,
    format: '2D',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '07:30 PM',
    regularPrice: 12,
    premiumPrice: 16,
    vipPrice: 22,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, moviesRes, theatresRes, showsRes, bookingsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/movies?activeOnly=false'),
        api.get('/theatres'),
        api.get('/shows'),
        api.get('/admin/bookings'),
      ]);

      setStats(statsRes.data.data);
      setMovies(moviesRes.data.data);
      setTheatres(theatresRes.data.data);
      setShows(showsRes.data.data);
      setAllBookings(bookingsRes.data.data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch admin console data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Movie
  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...movieForm,
        genre: movieForm.genre.split(',').map((g) => g.trim()),
        cast: movieForm.cast ? movieForm.cast.split(',').map((c) => c.trim()) : [],
      };
      await api.post('/movies', payload);
      setToast({ message: 'Movie created successfully!', type: 'success' });
      setShowMovieModal(false);
      loadData();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create movie', type: 'error' });
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to remove this movie?')) return;
    try {
      await api.delete(`/movies/${id}`);
      setToast({ message: 'Movie deactivated', type: 'success' });
      loadData();
    } catch {
      setToast({ message: 'Error deleting movie', type: 'error' });
    }
  };

  // Handlers for Theatre
  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: theatreForm.name,
        location: {
          city: theatreForm.city,
          address: theatreForm.address,
          state: theatreForm.state,
        },
        screens: Number(theatreForm.screens),
        facilities: theatreForm.facilities.split(',').map((f) => f.trim()),
      };
      await api.post('/theatres', payload);
      setToast({ message: 'Theatre added successfully!', type: 'success' });
      setShowTheatreModal(false);
      loadData();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create theatre', type: 'error' });
    }
  };

  // Handlers for Show
  const handleCreateShow = async (e) => {
    e.preventDefault();
    if (!showForm.movieId || !showForm.theatreId) {
      setToast({ message: 'Please select a movie and theatre', type: 'error' });
      return;
    }

    try {
      const payload = {
        movie: showForm.movieId,
        theatre: showForm.theatreId,
        screenNumber: Number(showForm.screenNumber),
        format: showForm.format,
        showDate: showForm.showDate,
        showTime: showForm.showTime,
        ticketPrice: {
          regular: Number(showForm.regularPrice),
          premium: Number(showForm.premiumPrice),
          vip: Number(showForm.vipPrice),
        },
      };

      await api.post('/shows', payload);
      setToast({ message: 'Show scheduled & 60 seats generated!', type: 'success' });
      setShowShowModal(false);
      loadData();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to schedule show', type: 'error' });
    }
  };

  const handleDeleteShow = async (id) => {
    if (!window.confirm('Cancel this show?')) return;
    try {
      await api.delete(`/shows/${id}`);
      setToast({ message: 'Show cancelled', type: 'success' });
      loadData();
    } catch {
      setToast({ message: 'Error cancelling show', type: 'error' });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Admin Management Console..." />;
  }

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      <div className="container">
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-amber" style={{ marginBottom: '0.4rem' }}>
              ADMINISTRATION CONSOLE
            </span>
            <h1 style={{ fontSize: '2rem', color: '#fff' }}>Cinema Control Center</h1>
          </div>

          {/* Quick Create Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowMovieModal(true)}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
            >
              <Plus size={16} /> Add Movie
            </button>
            <button
              onClick={() => setShowTheatreModal(true)}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
            >
              <Plus size={16} /> Add Theatre
            </button>
            <button
              onClick={() => {
                if (movies.length > 0 && !showForm.movieId) {
                  setShowForm((f) => ({ ...f, movieId: movies[0]._id }));
                }
                if (theatres.length > 0 && !showForm.theatreId) {
                  setShowForm((f) => ({ ...f, theatreId: theatres[0]._id }));
                }
                setShowShowModal(true);
              }}
              className="btn-outline"
              style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
            >
              <Calendar size={16} /> Schedule Show
            </button>
          </div>
        </div>

        {/* Analytics Metric Cards */}
        {stats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2.5rem',
            }}
          >
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Revenue</span>
                <DollarSign size={20} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#10b981', fontWeight: 800 }}>
                ${stats.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                From confirmed customer bookings
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Tickets Sold</span>
                <Ticket size={20} color="#e11d48" />
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
                {stats.totalBookings}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                {stats.totalCancelled} cancelled bookings
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Active Movies</span>
                <Film size={20} color="#38bdf8" />
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
                {stats.activeMovies}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                Showing across all multiplexes
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Multiplex Theatres</span>
                <Building size={20} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
                {stats.totalTheatres}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                With IMAX & Dolby Atmos
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #334155', marginBottom: '2rem' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'movies', label: `Movies (${movies.length})` },
            { id: 'theatres', label: `Theatres (${theatres.length})` },
            { id: 'shows', label: `Shows (${shows.length})` },
            { id: 'bookings', label: `All Transactions (${allBookings.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                borderBottom: activeTab === tab.id ? '2px solid #e11d48' : '2px solid transparent',
                color: activeTab === tab.id ? '#fff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.9rem',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1rem' }}>
              Recent Platform Bookings
            </h3>
            <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155', color: '#64748b' }}>
                    <th style={{ padding: '0.75rem' }}>ID</th>
                    <th style={{ padding: '0.75rem' }}>CUSTOMER</th>
                    <th style={{ padding: '0.75rem' }}>MOVIE</th>
                    <th style={{ padding: '0.75rem' }}>SEATS</th>
                    <th style={{ padding: '0.75rem' }}>AMOUNT</th>
                    <th style={{ padding: '0.75rem' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.slice(0, 5).map((b) => (
                    <tr key={b._id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1' }}>{b.bookingId}</td>
                      <td style={{ padding: '0.75rem', color: '#fff' }}>{b.user?.name || 'Customer'}</td>
                      <td style={{ padding: '0.75rem', color: '#38bdf8' }}>{b.show?.movie?.title || 'Movie'}</td>
                      <td style={{ padding: '0.75rem', color: '#e11d48', fontWeight: 600 }}>
                        {b.selectedSeats?.map((s) => s.seatNumber).join(', ')}
                      </td>
                      <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>${b.totalAmount?.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={b.bookingStatus === 'confirmed' ? 'badge badge-emerald' : 'badge badge-crimson'}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Movies */}
        {activeTab === 'movies' && (
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem' }}>POSTER</th>
                  <th style={{ padding: '0.75rem' }}>TITLE</th>
                  <th style={{ padding: '0.75rem' }}>GENRE</th>
                  <th style={{ padding: '0.75rem' }}>DURATION</th>
                  <th style={{ padding: '0.75rem' }}>RATING</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m._id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <img src={m.posterUrl} alt={m.title} style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: '#fff' }}>{m.title}</td>
                    <td style={{ padding: '0.75rem', color: '#94a3b8' }}>
                      {Array.isArray(m.genre) ? m.genre.join(', ') : m.genre}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{m.duration}m</td>
                    <td style={{ padding: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>★ {m.rating}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteMovie(m._id)}
                        style={{ color: '#f87171', background: 'transparent', padding: '4px', cursor: 'pointer' }}
                        title="Delete Movie"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Theatres */}
        {activeTab === 'theatres' && (
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem' }}>THEATRE NAME</th>
                  <th style={{ padding: '0.75rem' }}>CITY</th>
                  <th style={{ padding: '0.75rem' }}>ADDRESS</th>
                  <th style={{ padding: '0.75rem' }}>SCREENS</th>
                  <th style={{ padding: '0.75rem' }}>FACILITIES</th>
                </tr>
              </thead>
              <tbody>
                {theatres.map((t) => (
                  <tr key={t._id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: '#fff' }}>{t.name}</td>
                    <td style={{ padding: '0.75rem', color: '#38bdf8' }}>{t.location?.city}</td>
                    <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{t.location?.address}</td>
                    <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{t.screens} Screens</td>
                    <td style={{ padding: '0.75rem', color: '#10b981', fontSize: '0.8rem' }}>
                      {t.facilities?.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Shows */}
        {activeTab === 'shows' && (
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem' }}>MOVIE</th>
                  <th style={{ padding: '0.75rem' }}>THEATRE</th>
                  <th style={{ padding: '0.75rem' }}>DATE</th>
                  <th style={{ padding: '0.75rem' }}>TIME</th>
                  <th style={{ padding: '0.75rem' }}>FORMAT</th>
                  <th style={{ padding: '0.75rem' }}>SEATS LEFT</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((s) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: '#fff' }}>{s.movie?.title}</td>
                    <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{s.theatre?.name}</td>
                    <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>
                      {new Date(s.showDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>{s.showTime}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-cyan">{s.format}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>
                      {s.availableSeatsCount} / {s.totalSeats}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteShow(s._id)}
                        style={{ color: '#f87171', background: 'transparent', padding: '4px', cursor: 'pointer' }}
                        title="Cancel Show"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: Bookings */}
        {activeTab === 'bookings' && (
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem' }}>BOOKING ID</th>
                  <th style={{ padding: '0.75rem' }}>CUSTOMER</th>
                  <th style={{ padding: '0.75rem' }}>EMAIL</th>
                  <th style={{ padding: '0.75rem' }}>MOVIE & THEATRE</th>
                  <th style={{ padding: '0.75rem' }}>SEATS</th>
                  <th style={{ padding: '0.75rem' }}>TOTAL</th>
                  <th style={{ padding: '0.75rem' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.4)' }}>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1' }}>{b.bookingId}</td>
                    <td style={{ padding: '0.75rem', color: '#fff', fontWeight: 600 }}>{b.user?.name}</td>
                    <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{b.user?.email}</td>
                    <td style={{ padding: '0.75rem', color: '#38bdf8' }}>
                      {b.show?.movie?.title} ({b.show?.theatre?.name})
                    </td>
                    <td style={{ padding: '0.75rem', color: '#e11d48', fontWeight: 600 }}>
                      {b.selectedSeats?.map((s) => s.seatNumber).join(', ')}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                      ${b.totalAmount?.toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={b.bookingStatus === 'confirmed' ? 'badge badge-emerald' : 'badge badge-crimson'}>
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Movie */}
      {showMovieModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '580px', background: '#1e293b', borderRadius: '16px', padding: '2rem', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.5rem' }}>Add New Movie</h3>
            <form onSubmit={handleCreateMovie}>
              <div className="input-group">
                <label className="input-label">Title</label>
                <input required className="input-field" value={movieForm.title} onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea required className="input-field" rows={3} value={movieForm.description} onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Genres (comma separated)</label>
                  <input required className="input-field" value={movieForm.genre} onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Runtime (minutes)</label>
                  <input type="number" required className="input-field" value={movieForm.duration} onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Poster Image URL</label>
                <input required className="input-field" value={movieForm.posterUrl} placeholder="https://..." onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowMovieModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add Movie</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Theatre */}
      {showTheatreModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '540px', background: '#1e293b', borderRadius: '16px', padding: '2rem', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.5rem' }}>Add New Theatre</h3>
            <form onSubmit={handleCreateTheatre}>
              <div className="input-group">
                <label className="input-label">Theatre Name</label>
                <input required className="input-field" value={theatreForm.name} onChange={(e) => setTheatreForm({ ...theatreForm, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">City</label>
                  <input required className="input-field" value={theatreForm.city} onChange={(e) => setTheatreForm({ ...theatreForm, city: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Screens Count</label>
                  <input type="number" required className="input-field" value={theatreForm.screens} onChange={(e) => setTheatreForm({ ...theatreForm, screens: e.target.value })} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Address</label>
                <input required className="input-field" value={theatreForm.address} onChange={(e) => setTheatreForm({ ...theatreForm, address: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowTheatreModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create Theatre</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Show */}
      {showShowModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '560px', background: '#1e293b', borderRadius: '16px', padding: '2rem', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem' }}>Schedule Show & Seats</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              60 seats (VIP, Premium, Regular) will be automatically generated upon creation.
            </p>
            <form onSubmit={handleCreateShow}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Movie</label>
                  <select
                    className="input-field"
                    value={showForm.movieId}
                    onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
                  >
                    {movies.map((m) => (
                      <option key={m._id} value={m._id}>{m.title}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Theatre</label>
                  <select
                    className="input-field"
                    value={showForm.theatreId}
                    onChange={(e) => setShowForm({ ...showForm, theatreId: e.target.value })}
                  >
                    {theatres.map((t) => (
                      <option key={t._id} value={t._id}>{t.name} ({t.location?.city})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div className="input-group">
                  <label className="input-label">Format</label>
                  <select
                    className="input-field"
                    value={showForm.format}
                    onChange={(e) => setShowForm({ ...showForm, format: e.target.value })}
                  >
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="IMAX 2D">IMAX 2D</option>
                    <option value="IMAX 3D">IMAX 3D</option>
                    <option value="4DX">4DX</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Date</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={showForm.showDate}
                    onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Time</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="07:30 PM"
                    value={showForm.showTime}
                    onChange={(e) => setShowForm({ ...showForm, showTime: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div className="input-group">
                  <label className="input-label">VIP Price ($)</label>
                  <input type="number" className="input-field" value={showForm.vipPrice} onChange={(e) => setShowForm({ ...showForm, vipPrice: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Premium ($)</label>
                  <input type="number" className="input-field" value={showForm.premiumPrice} onChange={(e) => setShowForm({ ...showForm, premiumPrice: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Regular ($)</label>
                  <input type="number" className="input-field" value={showForm.regularPrice} onChange={(e) => setShowForm({ ...showForm, regularPrice: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Schedule Show</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
