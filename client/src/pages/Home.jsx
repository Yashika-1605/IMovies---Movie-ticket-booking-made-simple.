import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Film,
  Search,
  SlidersHorizontal,
  Play,
  Star,
  Clock,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';
import { fetchMovies, fetchFeaturedMovies, setSelectedGenre, setSearchQuery } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Thriller', 'Animation', 'Biography'];

const Home = () => {
  const dispatch = useDispatch();
  const { movies, featuredMovies, loading, selectedGenre, searchQuery } = useSelector((state) => state.movies);
  const { selectedCity } = useSelector((state) => state.theatres);

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchFeaturedMovies());
    dispatch(fetchMovies({ genre: selectedGenre, search: searchQuery }));
  }, [dispatch, selectedGenre, searchQuery]);

  const heroMovie = featuredMovies && featuredMovies.length > 0 ? featuredMovies[activeHeroIndex] : null;

  const handleGenreClick = (genre) => {
    dispatch(setSelectedGenre(genre));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <div>
      {/* Cinematic Hero Section */}
      {heroMovie && (
        <section
          style={{
            position: 'relative',
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            backgroundImage: `linear-gradient(to right, rgba(11, 15, 25, 0.95) 30%, rgba(11, 15, 25, 0.6) 70%, rgba(11, 15, 25, 0.95)), url(${heroMovie.backdropUrl || heroMovie.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
          }}
        >
          <div className="container" style={{ position: 'relative', zIndex: 10, padding: '4rem 1.5rem' }}>
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <span className="badge badge-crimson">NOW SHOWING</span>
                <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={12} fill="#f59e0b" /> {heroMovie.rating ? heroMovie.rating.toFixed(1) : '8.8'} Rating
                </span>
                <span className="badge badge-cyan">{heroMovie.language || 'English'}</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', lineHeight: 1.1, marginBottom: '1rem', color: '#fff' }}>
                {heroMovie.title}
              </h1>

              <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {heroMovie.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to={`/movie/${heroMovie._id}`} className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                  <Film size={18} /> Book Tickets Now
                </Link>

                {heroMovie.trailerUrl && (
                  <a
                    href={heroMovie.trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{ padding: '0.85rem 1.6rem', fontSize: '1rem' }}
                  >
                    <Play size={18} color="#e11d48" /> Watch Trailer
                  </a>
                )}
              </div>
            </div>

            {/* Hero Carousel Indicators */}
            {featuredMovies.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '3rem' }}>
                {featuredMovies.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHeroIndex(idx)}
                    style={{
                      width: activeHeroIndex === idx ? '32px' : '10px',
                      height: '8px',
                      borderRadius: '4px',
                      background: activeHeroIndex === idx ? '#e11d48' : 'rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Search & Genre Filter Bar */}
      <section style={{ padding: '2.5rem 0 1rem' }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search Input */}
              <div
                style={{
                  flex: 1,
                  minWidth: '260px',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '0.6rem 1rem',
                  gap: '0.6rem',
                }}
              >
                <Search size={18} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search movies by title or keyword..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.95rem',
                  }}
                />
              </div>

              {/* City Indicator Notice */}
              {selectedCity !== 'All' && (
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  Showing cinemas in <strong style={{ color: '#e11d48' }}>{selectedCity}</strong>
                </div>
              )}
            </div>

            {/* Genre Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginRight: '0.4rem' }}>
                GENRES:
              </span>
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreClick(genre)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    background: selectedGenre === genre ? '#e11d48' : '#1e293b',
                    color: selectedGenre === genre ? '#fff' : '#94a3b8',
                    border: `1px solid ${selectedGenre === genre ? '#e11d48' : '#334155'}`,
                  }}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>Now In Cinemas</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Select a movie to choose theatre showtimes and lock seats in real time.
              </p>
            </div>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {movies.length} {movies.length === 1 ? 'Movie' : 'Movies'} Available
            </span>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching latest cinema schedule..." />
          ) : movies.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
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
              <Film size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem' }}>No Movies Found</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                We couldn't find any movies matching "{searchQuery}" or genre "{selectedGenre}".
              </p>
              <button
                onClick={() => {
                  dispatch(setSelectedGenre('All'));
                  dispatch(setSearchQuery(''));
                }}
                className="btn-outline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Cinema Experience Features */}
      <section style={{ padding: '3rem 0', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            <div className="glass-panel" style={{ padding: '1.8rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(225, 29, 72, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Zap size={22} color="#e11d48" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>
                Real-Time Seat Locking
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Powered by Socket.io. When you click a seat, it locks exclusively for 10 minutes, eliminating double-booking collisions.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.8rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Sparkles size={22} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>
                VIP & IMAX Formats
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Experience cinema in IMAX 3D, Dolby Atmos, and 4DX with ultra-comfortable recliner seat tiers.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.8rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <ShieldCheck size={22} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>
                Instant Digital Tickets
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Generate QR-coded digital tickets instantly upon checkout with flexible cancellation and refund options.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
