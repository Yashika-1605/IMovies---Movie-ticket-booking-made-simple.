import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Fetch distinct cities
export const fetchCities = createAsyncThunk('theatres/fetchCities', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/theatres/cities');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cities');
  }
});

// Fetch all theatres
export const fetchTheatres = createAsyncThunk(
  'theatres/fetchTheatres',
  async (city = '', { rejectWithValue }) => {
    try {
      const url = city && city !== 'All' ? `/theatres?city=${encodeURIComponent(city)}` : '/theatres';
      const { data } = await api.get(url);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch theatres');
    }
  }
);

const theatreSlice = createSlice({
  name: 'theatres',
  initialState: {
    theatres: [],
    cities: [],
    selectedCity: 'All',
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload;
      })
      .addCase(fetchTheatres.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTheatres.fulfilled, (state, action) => {
        state.loading = false;
        state.theatres = action.payload;
      })
      .addCase(fetchTheatres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCity } = theatreSlice.actions;
export default theatreSlice.reducer;
