// src/redux/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Axios instance pointing at admin endpoints
const API = axios.create({ baseURL: 'http://localhost:5000/api/admin' });
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

// ─── Thunks ────────────────────────────────────────────────────────────
// 1) Fetch profile
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, thunkAPI) => {
    try {
      const res = await API.get('/profile');
      return res.data; // full user object
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);



export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (formData, thunkAPI) => {
      try {
        const res = await API.put('/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return res.data.user;
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || err.message
        );
      }
    }
  );

// 3) Change password
export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async ({ currentPassword, newPassword }, thunkAPI) => {
    try {
      const res = await API.put('/profile/password', {
        currentPassword,
        newPassword
      });
      return res.data.message; // success message
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    loading: false,
    error: null,
    passwordMessage: null
  },
  reducers: {
    clearPasswordMessage(state) {
      state.passwordMessage = null;
    }
  },
  extraReducers: builder => {
    builder
      // fetchProfile
      .addCase(fetchProfile.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, { payload }) => {
        state.loading = false; state.user = payload;
      })
      .addCase(fetchProfile.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload;
      })
      // updateProfile
      .addCase(updateProfile.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.loading = false; state.user = payload;
      })
      .addCase(updateProfile.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload;
      })
      // changePassword
      .addCase(changePassword.pending, state => {
        state.loading = true; state.error = null; state.passwordMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, { payload }) => {
        state.loading = false; state.passwordMessage = payload;
      })
      .addCase(changePassword.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload;
      });
  }
});

export const { clearPasswordMessage } = profileSlice.actions;
export default profileSlice.reducer;
