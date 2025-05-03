
// src/redux/slices/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ── 1) Create an Axios instance pointed at your backend ─────────────
const API = axios.create({
  baseURL: 'http://localhost:5000',  // ← ensure your Express server is here
});

// ── 2) Attach JWT & Log every request/response ──────────────────────
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log('API Request:', config.method.toUpperCase(), config.url, 'Token:', token);
    if (token) config.headers['x-auth-token'] = token;
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  response => response,
  error => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

// ============================
// Thunks (Async Actions)
// ============================

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/api/admin/users');
      return response.data;
    } catch (err) {
      // Log full error so you can inspect network/headers/etc
      console.error('fetchUsers thunk error:', err);
      // Pick a real message if the server sent one, otherwise err.message
      const message =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        'Failed to fetch users';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add a new user
export const addUser = createAsyncThunk('admin/addUser', async (userData, thunkAPI) => {
  try {
    const response = await API.post('/api/admin/users', userData);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to add user');
  }
});

// Delete a user
export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId, thunkAPI) => {
  try {
    await API.delete(`/api/admin/users/${userId}`);
    return userId;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete user');
  }
});

// Fetch reports
export const fetchReports = createAsyncThunk('admin/fetchReports', async (_, thunkAPI) => {
  try {
    const response = await API.get('/api/admin/reports');
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch reports');
  }
});

// Resolve a report
export const resolveReport = createAsyncThunk('admin/resolveReport', async (reportId, thunkAPI) => {
  try {
    const response = await API.patch(`/api/admin/reports/${reportId}/resolve`);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to resolve report');
  }
});

// Fetch analytics
export const fetchAnalytics = createAsyncThunk('admin/fetchAnalytics', async (_, thunkAPI) => {
  try {
    const response = await API.get('/api/admin/analytics');
    return response.data;
    
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch analytics');
  }
});

// ============================
// Initial State
// ============================

const initialState = {
  users: [],
  reports: [],
  analytics: {},
  loading: false,
  error: null,
};

// ============================
// Slice
// ============================

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Handle all async thunks

    // Users
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Reports
    builder
      .addCase(fetchReports.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(resolveReport.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resolveReport.fulfilled, (state, action) => {
        state.loading = false;
        // Update resolved report in state
        const index = state.reports.findIndex(r => r._id === action.payload._id);
        if (index !== -1) state.reports[index] = action.payload;
      })
      .addCase(resolveReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Analytics
    builder
      .addCase(fetchAnalytics.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default adminSlice.reducer;
