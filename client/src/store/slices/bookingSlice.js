import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Fetch seat matrix for a show
export const fetchSeatsForShow = createAsyncThunk(
  'booking/fetchSeatsForShow',
  async (showId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/seats/show/${showId}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch seats');
    }
  }
);

// Create Booking & Process Payment
export const confirmBooking = createAsyncThunk(
  'booking/confirmBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/bookings', bookingData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Booking failed');
    }
  }
);

// Fetch user's booking history
export const fetchMyBookings = createAsyncThunk(
  'booking/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

// Cancel user booking
export const cancelUserBooking = createAsyncThunk(
  'booking/cancelUserBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/bookings/${bookingId}/cancel`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Cancellation failed');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    currentShow: null,
    seats: [],
    selectedSeats: [],
    myBookings: [],
    currentBooking: null,
    loading: false,
    error: null,
    bookingSuccess: false,
  },
  reducers: {
    setCurrentShow: (state, action) => {
      state.currentShow = action.payload;
    },
    toggleSelectSeat: (state, action) => {
      const seat = action.payload;
      const index = state.selectedSeats.findIndex((s) => s._id === seat._id);
      if (index >= 0) {
        state.selectedSeats.splice(index, 1);
      } else {
        if (state.selectedSeats.length >= 8) {
          return; // Max 8 seats per booking
        }
        state.selectedSeats.push(seat);
      }
    },
    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
    },
    resetBookingState: (state) => {
      state.selectedSeats = [];
      state.currentBooking = null;
      state.bookingSuccess = false;
      state.error = null;
    },
    // Socket Real-time Event handlers
    updateSeatLocked: (state, action) => {
      const { seatId, lockedBy, lockedUntil } = action.payload;
      const seat = state.seats.find((s) => s._id === seatId);
      if (seat) {
        seat.status = 'locked';
        seat.lockedBy = lockedBy;
        seat.lockedUntil = lockedUntil;
      }
    },
    updateSeatUnlocked: (state, action) => {
      const { seatId } = action.payload;
      const seat = state.seats.find((s) => s._id === seatId);
      if (seat && seat.status !== 'booked') {
        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockedUntil = null;
      }
    },
    updateSeatsBooked: (state, action) => {
      const { seatIds } = action.payload;
      if (Array.isArray(seatIds)) {
        state.seats.forEach((seat) => {
          if (seatIds.includes(seat._id.toString())) {
            seat.status = 'booked';
          }
        });
        // Remove from selected if someone else booked it
        state.selectedSeats = state.selectedSeats.filter(
          (s) => !seatIds.includes(s._id.toString())
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch seats
      .addCase(fetchSeatsForShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeatsForShow.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = action.payload;
      })
      .addCase(fetchSeatsForShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Confirm Booking
      .addCase(confirmBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.bookingSuccess = false;
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingSuccess = true;
        state.currentBooking = action.payload;
        state.selectedSeats = [];
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel booking
      .addCase(cancelUserBooking.fulfilled, (state, action) => {
        const index = state.myBookings.findIndex((b) => b._id === action.payload._id);
        if (index >= 0) {
          state.myBookings[index] = action.payload;
        }
      });
  },
});

export const {
  setCurrentShow,
  toggleSelectSeat,
  clearSelectedSeats,
  resetBookingState,
  updateSeatLocked,
  updateSeatUnlocked,
  updateSeatsBooked,
} = bookingSlice.actions;

export default bookingSlice.reducer;
