// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import skillsReducer from './slices/skillsSlice';  
import notificationReducer from './slices/notificationSlice';
import adminReducer from './slices/adminSlice';    // Admin dashboard slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    skills: skillsReducer,
    notifications: notificationReducer,
    admin: adminReducer     // Redux state for admin dashboard
  },
});

export default store;