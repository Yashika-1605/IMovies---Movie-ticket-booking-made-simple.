import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

const MovieCard = ({ movie }) => {
  // Format duration into hours and minutes
  const formatDuration = (mins) => {
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    return `${hours}h ${remainder > 0 ? remainder + 'm' : ''}`;
  };

  return (
    <div
      style={{
        background: '#1e293b',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = '#e11d48';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#334155';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Poster Image Container */}
      <Link to={`/movie/${movie._id}`} style={{ position: 'relative', width: '100%', paddingTop: '140%', overflow: 'hidden' }}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Rating Badge */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(11, 15, 25, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: '1px solid rgba(245, 158, 11, 0.4)',
          }}
        >
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
            {movie.rating ? movie.rating.toFixed(1) : '8.0'}
          </span>
        </div>

        {/* Language Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: '6px',
            padding: '2px 8px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#cbd5e1',
          }}
        >
          {movie.language || 'English'}
        </div>
      </Link>

      {/* Card Info Body */}
      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Link to={`/movie/${movie._id}`}>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#f8fafc',
              marginBottom: '0.4rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {movie.title}
          </h3>
        </Link>

        {/* Genres & Runtime */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', color: '#94a3b8', fontSize: '0.8rem' }}>
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '65%' }}>
            {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={13} /> {formatDuration(movie.duration)}
          </span>
        </div>

        {/* Action Button */}
        <Link
          to={`/movie/${movie._id}`}
          className="btn-primary"
          style={{
            marginTop: 'auto',
            width: '100%',
            padding: '0.6rem 0',
            fontSize: '0.85rem',
          }}
        >
          Book Tickets
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
