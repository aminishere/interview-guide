import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  defaultTimeLimits: {
    easy: 60, // seconds
    medium: 90,
    hard: 120,
  },
};

const questionsConfigSlice = createSlice({
  name: "questionsConfig",
  initialState,
  reducers: {
    setTimeLimit(state, action) {
      const { difficulty, time } = action.payload;
      if (state.defaultTimeLimits[difficulty] !== undefined) {
        state.defaultTimeLimits[difficulty] = time;
      }
    },
  },
});

export const { setTimeLimit } = questionsConfigSlice.actions;

export default questionsConfigSlice.reducer;
