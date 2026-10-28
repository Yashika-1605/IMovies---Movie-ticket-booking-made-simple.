import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import theatreReducer from './slices/theatreSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    theatres: theatreReducer,
    booking: bookingReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
