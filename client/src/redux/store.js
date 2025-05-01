// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import skillsReducer from './slices/skillsSlice';  // Add skills reducer
import adminReducer from './slices/adminSlice';    // Admin dashboard slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    skills: skillsReducer,  // Redux state for skills
    admin: adminReducer     // Redux state for admin dashboard
  },
});

export default store;