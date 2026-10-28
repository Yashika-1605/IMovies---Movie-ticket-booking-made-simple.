import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Fetch all movies (with optional query filters: genre, language, search)
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.genre && filters.genre !== 'All') params.append('genre', filters.genre);
      if (filters.language && filters.language !== 'All') params.append('language', filters.language);
      if (filters.search) params.append('search', filters.search);

      const { data } = await api.get(`/movies?${params.toString()}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch movies');
    }
  }
);

// Fetch featured movies for hero section
export const fetchFeaturedMovies = createAsyncThunk(
  'movies/fetchFeaturedMovies',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/movies/featured');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch featured movies');
    }
  }
);

// Fetch single movie details & upcoming shows
export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/movies/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch movie details');
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    featuredMovies: [],
    selectedMovie: null,
    movieShows: [],
    loading: false,
    error: null,
    selectedGenre: 'All',
    selectedLanguage: 'All',
    searchQuery: '',
  },
  reducers: {
    setSelectedGenre: (state, action) => {
      state.selectedGenre = action.payload;
    },
    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Featured movies
      .addCase(fetchFeaturedMovies.fulfilled, (state, action) => {
        state.featuredMovies = action.payload;
      })
      // Single movie by ID
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMovie = action.payload.movie;
        state.movieShows = action.payload.shows;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedGenre, setSelectedLanguage, setSearchQuery } = movieSlice.actions;
export default movieSlice.reducer;
