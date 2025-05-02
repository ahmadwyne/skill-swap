// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import skillsReducer from './slices/skillsSlice';  
import notificationReducer from './slices/notificationSlice';
import adminReducer from './slices/adminSlice';    // Admin dashboard slice
import profileReducer from './slices/adminProfileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    skills: skillsReducer,
    notifications: notificationReducer,
    admin: adminReducer,     // Redux state for admin dashboard
    profile: profileReducer, // Redux state for admin profile
  },
});

export default store;