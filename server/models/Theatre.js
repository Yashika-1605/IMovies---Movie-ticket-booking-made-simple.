const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide theatre name'],
      trim: true,
    },
    location: {
      city: {
        type: String,
        required: [true, 'Please provide city'],
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Please provide physical address'],
        trim: true,
      },
      state: {
        type: String,
        default: '',
        trim: true,
      },
    },
    screens: {
      type: Number,
      default: 3,
      min: [1, 'Theatre must have at least 1 screen'],
    },
    facilities: {
      type: [String],
      default: ['Dolby Atmos', '4K Projection', 'Recliner Seats', 'Food Court', 'Parking'],
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

theatreSchema.index({ 'location.city': 1, name: 1 });

module.exports = mongoose.model('Theatre', theatreSchema);
