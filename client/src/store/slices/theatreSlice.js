import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { MOCK_CITIES, MOCK_THEATRES } from '../../data/mockData';

// Fetch distinct cities
export const fetchCities = createAsyncThunk('theatres/fetchCities', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/theatres/cities');
    if (data && data.data && data.data.length > 0) {
      return data.data;
    }
    return MOCK_CITIES;
  } catch (err) {
    return MOCK_CITIES;
  }
});

// Fetch all theatres
export const fetchTheatres = createAsyncThunk(
  'theatres/fetchTheatres',
  async (city = '', { rejectWithValue }) => {
    try {
      const url = city && city !== 'All' ? `/theatres?city=${encodeURIComponent(city)}` : '/theatres';
      const { data } = await api.get(url);
      if (data && data.data && data.data.length > 0) {
        return data.data;
      }
      throw new Error('Using fallback theatres');
    } catch (err) {
      if (city && city !== 'All') {
        return MOCK_THEATRES.filter((t) => t.location.city.toLowerCase() === city.toLowerCase());
      }
      return MOCK_THEATRES;
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
