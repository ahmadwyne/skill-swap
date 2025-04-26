// src/redux/slices/skillsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  skillsToTeach: [],
  skillsToLearn: [],
  loading: false,
  error: null,
};

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setSkillsToTeach: (state, action) => {
      state.skillsToTeach = action.payload;
    },
    setSkillsToLearn: (state, action) => {
      state.skillsToLearn = action.payload;
    },
    loadingSkills: (state) => {
      state.loading = true;
    },
    skillsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearSkills: (state) => {
      state.skillsToTeach = [];
      state.skillsToLearn = [];
    },
  },
});

export const {
  setSkillsToTeach,
  setSkillsToLearn,
  loadingSkills,
  skillsError,
  clearSkills,
} = skillsSlice.actions;

export default skillsSlice.reducer;