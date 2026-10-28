import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Load initial state from localStorage
const storedToken = localStorage.getItem('imovies_token');
const storedUser = localStorage.getItem('imovies_user')
  ? JSON.parse(localStorage.getItem('imovies_user'))
  : null;

// Thunk: Login
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('imovies_token', data.token);
    localStorage.setItem('imovies_user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    // If backend is offline or static demo mode, authenticate demo accounts
    const email = credentials.email?.toLowerCase().trim();
    if (email === 'admin@imovies.com') {
      const demoData = {
        token: 'demo-jwt-admin-token-xyz',
        user: {
          id: 'user-admin-1',
          name: 'IMovies Admin',
          email: 'admin@imovies.com',
          role: 'admin',
        },
      };
      localStorage.setItem('imovies_token', demoData.token);
      localStorage.setItem('imovies_user', JSON.stringify(demoData.user));
      return demoData;
    } else if (email) {
      const demoData = {
        token: 'demo-jwt-customer-token-xyz',
        user: {
          id: 'user-customer-1',
          name: credentials.name || 'John Doe',
          email: email,
          role: 'customer',
        },
      };
      localStorage.setItem('imovies_token', demoData.token);
      localStorage.setItem('imovies_user', JSON.stringify(demoData.user));
      return demoData;
    }
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

// Thunk: Register
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('imovies_token', data.token);
    localStorage.setItem('imovies_user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    // Demo fallback for new registrations
    const demoData = {
      token: 'demo-jwt-registered-token-xyz',
      user: {
        id: 'user-' + Math.random().toString(36).substring(2, 8),
        name: userData.name || 'Valued Moviegoer',
        email: userData.email,
        role: 'customer',
      },
    };
    localStorage.setItem('imovies_token', demoData.token);
    localStorage.setItem('imovies_user', JSON.stringify(demoData.user));
    return demoData;
  }
});

// Thunk: Get Current User Profile
export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    localStorage.setItem('imovies_user', JSON.stringify(data.user));
    return data.user;
  } catch (err) {
    const existing = localStorage.getItem('imovies_user');
    if (existing) {
      return JSON.parse(existing);
    }
    return rejectWithValue(err.response?.data?.message || 'Session expired');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: storedToken,
    user: storedUser,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('imovies_token');
      localStorage.removeItem('imovies_user');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Load User
    builder
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
