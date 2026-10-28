import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { MOCK_MOVIES, generateMockShows } from '../../data/mockData';

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
      if (data && data.data && data.data.length > 0) {
        return data.data;
      }
      throw new Error('No movies from API, using fallback data');
    } catch (err) {
      // Fallback to high-fidelity mock dataset
      let result = [...MOCK_MOVIES];
      if (filters.genre && filters.genre !== 'All') {
        result = result.filter((m) => m.genre.includes(filters.genre));
      }
      if (filters.language && filters.language !== 'All') {
        result = result.filter((m) => m.language.toLowerCase() === filters.language.toLowerCase());
      }
      if (filters.search && filters.search.trim() !== '') {
        const q = filters.search.toLowerCase().trim();
        result = result.filter(
          (m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
        );
      }
      return result;
    }
  }
);

// Fetch featured movies for hero section
export const fetchFeaturedMovies = createAsyncThunk(
  'movies/fetchFeaturedMovies',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/movies/featured');
      if (data && data.data && data.data.length > 0) {
        return data.data;
      }
      throw new Error('No featured movies from API');
    } catch (err) {
      return MOCK_MOVIES.slice(0, 5);
    }
  }
);

// Fetch single movie details & upcoming shows
export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/movies/${id}`);
      if (data && data.data && data.data.movie) {
        return data.data;
      }
      throw new Error('Movie not found on API');
    } catch (err) {
      const movie =
        MOCK_MOVIES.find((m) => m._id === id || m.title.toLowerCase().replace(/[^a-z0-9]/g, '') === id) ||
        MOCK_MOVIES[0];

      const allShows = generateMockShows();
      const movieShows = allShows.filter((s) => s.movie._id === movie._id || s.movie.title === movie.title);

      return {
        movie,
        shows: movieShows,
      };
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
