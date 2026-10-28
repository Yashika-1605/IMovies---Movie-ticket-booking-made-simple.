import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Film,
  Calendar,
  Clock,
  Star,
  MapPin,
  Play,
  Share2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { fetchMovieById } from '../store/slices/movieSlice';
import { setCurrentShow } from '../store/slices/bookingSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedMovie, movieShows, loading } = useSelector((state) => state.movies);
  const { selectedCity } = useSelector((state) => state.theatres);

  // Date selection tabs: Today, Tomorrow, +2 days, +3 days
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const dates = [0, 1, 2, 3].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return {
      dateObj: d,
      dayName: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateFormatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isoString: d.toISOString().split('T')[0],
    };
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById(id));
    }
  }, [dispatch, id]);

  const handleSelectShowtime = (show) => {
    dispatch(setCurrentShow(show));
    navigate(`/seats/${show._id}`);
  };

  if (loading || !selectedMovie) {
    return <LoadingSpinner message="Loading movie details and cinema showtimes..." />;
  }

  // Filter shows by selected date and optional city
  const activeDate = dates[selectedDateIndex];
  const filteredShows = movieShows.filter((show) => {
    const showDateStr = new Date(show.showDate).toISOString().split('T')[0];
    const matchDate = showDateStr === activeDate.isoString;
    const matchCity =
      selectedCity === 'All' ||
      (show.theatre &&
        show.theatre.location &&
        show.theatre.location.city.toLowerCase() === selectedCity.toLowerCase());
    return matchDate && matchCity;
  });

  // Group filtered shows by Theatre
  const showsByTheatre = filteredShows.reduce((acc, show) => {
    const theatreId = show.theatre?._id || 'unknown';
    if (!acc[theatreId]) {
      acc[theatreId] = {
        theatre: show.theatre,
        shows: [],
      };
    }
    acc[theatreId].shows.push(show);
    return acc;
  }, {});

  const formatDuration = (mins) => {
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    return `${hours}h ${remainder > 0 ? remainder + 'm' : ''}`;
  };

  return (
    <div>
      {/* Movie Hero Banner */}
      <section
        style={{
          position: 'relative',
          padding: '4rem 0 3rem',
          backgroundImage: `linear-gradient(to bottom, rgba(11, 15, 25, 0.85) 0%, rgba(11, 15, 25, 0.98) 100%), url(${selectedMovie.backdropUrl || selectedMovie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Poster Card */}
            <div
              style={{
                width: '260px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                border: '1px solid #334155',
                flexShrink: 0,
              }}
            >
              <img
                src={selectedMovie.posterUrl}
                alt={selectedMovie.title}
                style={{ width: '100%', height: '370px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>

            {/* Movie Synopsis & Metadata */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <span className="badge badge-crimson">{selectedMovie.language || 'English'}</span>
                {Array.isArray(selectedMovie.genre) &&
                  selectedMovie.genre.map((g) => (
                    <span key={g} className="badge badge-cyan">
                      {g}
                    </span>
                  ))}
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '1rem', lineHeight: 1.15 }}>
                {selectedMovie.title}
              </h1>

              {/* Quick Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', color: '#cbd5e1', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Star size={18} color="#f59e0b" fill="#f59e0b" />
                  <strong style={{ color: '#fff' }}>{selectedMovie.rating ? selectedMovie.rating.toFixed(1) : '8.5'}</strong> / 10
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={16} color="#94a3b8" />
                  <span>{formatDuration(selectedMovie.duration)}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={16} color="#94a3b8" />
                  <span>{new Date(selectedMovie.releaseDate).getFullYear()}</span>
                </div>
              </div>

              {/* Description */}
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '800px' }}>
                {selectedMovie.description}
              </p>

              {/* Cast & Director */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '2rem' }}>
                {selectedMovie.director && (
                  <div>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Director: </span>
                    {selectedMovie.director}
                  </div>
                )}
                {selectedMovie.cast && selectedMovie.cast.length > 0 && (
                  <div>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Starring: </span>
                    {selectedMovie.cast.join(', ')}
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedMovie.trailerUrl && (
                <a
                  href={selectedMovie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ display: 'inline-flex', padding: '0.65rem 1.4rem' }}
                >
                  <Play size={16} color="#e11d48" /> Watch Official Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Showtime Booking Section */}
      <section style={{ padding: '3rem 0 5rem' }}>
        <div className="container">
          {/* Section Heading */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>
              Select Date & Showtime
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Choose your preferred date, multiplex theatre, and screening format.
            </p>
          </div>

          {/* Date Selector Pills */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {dates.map((dateItem, idx) => (
              <button
                key={dateItem.isoString}
                onClick={() => setSelectedDateIndex(idx)}
                style={{
                  minWidth: '100px',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '12px',
                  background: selectedDateIndex === idx ? '#e11d48' : '#1e293b',
                  border: `1px solid ${selectedDateIndex === idx ? '#e11d48' : '#334155'}`,
                  color: selectedDateIndex === idx ? '#fff' : '#94a3b8',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedDateIndex === idx ? '0 4px 15px rgba(225, 29, 72, 0.4)' : 'none',
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  {dateItem.dayName}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: selectedDateIndex === idx ? '#fff' : '#f8fafc' }}>
                  {dateItem.dateFormatted}
                </span>
              </button>
            ))}
          </div>

          {/* Theatres Listing */}
          {Object.keys(showsByTheatre).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Object.values(showsByTheatre).map(({ theatre, shows }) => (
                <div
                  key={theatre?._id || Math.random()}
                  className="glass-panel"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                  }}
                >
                  {/* Theatre Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.3rem' }}>
                        {theatre?.name || 'Multiplex Cinema'}
                      </h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} color="#e11d48" /> {theatre?.location?.address || 'City Center'}, {theatre?.location?.city || ''}
                      </p>
                    </div>

                    {/* Facilities Tags */}
                    {theatre?.facilities && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {theatre.facilities.slice(0, 3).map((f) => (
                          <span key={f} className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Showtimes Pills */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid #334155', paddingTop: '1.25rem' }}>
                    {shows.map((show) => (
                      <button
                        key={show._id}
                        onClick={() => handleSelectShowtime(show)}
                        style={{
                          background: '#111827',
                          border: '1px solid #475569',
                          borderRadius: '10px',
                          padding: '0.75rem 1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#e11d48';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#475569';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>
                          {show.showTime}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600 }}>
                            {show.format || '2D'}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>•</span>
                          <span style={{ fontSize: '0.7rem', color: '#f8fafc', fontWeight: 600 }}>
                            From ${show.ticketPrice?.regular || 12}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
                          {show.availableSeatsCount} seats left
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                background: '#1e293b',
                borderRadius: '16px',
                border: '1px dashed #334155',
              }}
            >
              <Info size={36} color="#64748b" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.4rem' }}>
                No Showtimes Scheduled For This Date
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Please select another date tab above or switch cities in the navbar.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;
