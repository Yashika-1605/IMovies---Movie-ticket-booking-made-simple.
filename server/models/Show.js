const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Show must be linked to a movie'],
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Show must be linked to a theatre'],
    },
    screenNumber: {
      type: Number,
      default: 1,
    },
    format: {
      type: String,
      enum: ['2D', '3D', 'IMAX 2D', 'IMAX 3D', '4DX'],
      default: '2D',
    },
    showDate: {
      type: Date,
      required: [true, 'Please provide show date'],
    },
    showTime: {
      type: String,
      required: [true, 'Please provide show time (e.g., 07:30 PM)'],
    },
    ticketPrice: {
      regular: {
        type: Number,
        required: true,
        default: 12,
      },
      premium: {
        type: Number,
        required: true,
        default: 16,
      },
      vip: {
        type: Number,
        required: true,
        default: 22,
      },
    },
    totalSeats: {
      type: Number,
      default: 60,
    },
    availableSeatsCount: {
      type: Number,
      default: 60,
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

showSchema.index({ movie: 1, theatre: 1, showDate: 1 });

module.exports = mongoose.model('Show', showSchema);
