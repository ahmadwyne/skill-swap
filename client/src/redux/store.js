// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import skillsReducer from './slices/skillsSlice';  // Add skills reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    skills: skillsReducer,  // Redux state for skills
  },
});

export default store;