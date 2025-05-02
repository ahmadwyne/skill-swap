import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to update user profile
export const updateProfile = createAsyncThunk('profile/updateProfile', async (formData, thunkAPI) => {
  const token = localStorage.getItem('token');
  const res = await axios.put('http://localhost:5000/api/users/profile', formData, {
    headers: { 'x-auth-token': token },
  });
  return res.data;
});

// Slice to handle profile state
const profileSlice = createSlice({
  name: 'profile',
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => { state.user = action.payload; }, // Directly set user profile
  },
  extraReducers: (builder) => {
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload; // Update profile on successful change
    });
  }
});

export const { setUser } = profileSlice.actions;
export default profileSlice.reducer;
