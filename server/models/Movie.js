const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a movie description'],
    },
    genre: {
      type: [String],
      required: [true, 'Please provide at least one genre'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'A movie must have at least one genre',
      },
    },
    language: {
      type: String,
      required: [true, 'Please provide the language'],
      default: 'English',
    },
    duration: {
      type: Number,
      required: [true, 'Please provide movie duration in minutes'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Please provide release date'],
    },
    posterUrl: {
      type: String,
      required: [true, 'Please provide a poster image URL or file path'],
    },
    backdropUrl: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be lower than 0'],
      max: [10, 'Rating cannot exceed 10'],
      default: 8.0,
    },
    director: {
      type: String,
      default: '',
    },
    cast: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search queries
movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
