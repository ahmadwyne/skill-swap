// profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const updateProfile = createAsyncThunk('profile/updateProfile', async (formData) => {
  const res = await axios.put('/api/users/profile', formData);
  return res.data;
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => { state.user = action.payload; } // Directly set user profile
  },
  extraReducers: (builder) => {
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload; // Update profile on successful change
    });
  }
});

export const { setUser } = profileSlice.actions;
export default profileSlice.reducer;