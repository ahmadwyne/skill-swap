// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';  // Updated import path for authSlice

const store = configureStore({
  reducer: {
    auth: authReducer,  // Redux state for auth
  },
});

export default store;