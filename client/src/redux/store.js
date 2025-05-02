// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import skillsReducer from './slices/skillsSlice';  
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    skills: skillsReducer,
    notifications: notificationReducer,
  },
});

export default store;