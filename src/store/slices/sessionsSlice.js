import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: [],       // filled on Start Interview
  currentQuestion: 0,  // index
  paused: false,
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    startInterview: (state, action) => {
      state.questions = action.payload.questions.map(q => ({
        ...q,
        startTs: null,
        elapsedBeforePauseMs: 0,
        answer: "",
        submittedAt: null,
      }));
      state.currentQuestion = 0;
      state.paused = false;
    },
    startQuestion: (state, action) => {
      const q = state.questions[action.payload];
      q.startTs = Date.now();
    },
    pauseQuestion: (state) => {
      const q = state.questions[state.currentQuestion];
      if (!q.startTs) return;
      
      q.elapsedBeforePauseMs += Date.now() - q.startTs;
      q.startTs = null;
      state.paused = true;
    },
    resumeQuestion: (state) => {
      const q = state.questions[state.currentQuestion];
      q.startTs = Date.now();
      state.paused = false;
    },
    submitAnswer: (state, action) => {
      const q = state.questions[state.currentQuestion];
      q.answer = action.payload;
      q.submittedAt = Date.now();
      if (q.startTs) {
        q.elapsedBeforePauseMs += Date.now() - q.startTs;
        q.startTs = null;
      }
    },
    nextQuestion: (state) => {
      state.currentQuestion += 1;
    },
    resetSession: (state) => {
      state.questions = [];
      state.currentQuestion = 0;
      state.paused = false;
    },
  },
});

export const {
  startInterview,
  startQuestion,
  pauseQuestion,
  resumeQuestion,
  submitAnswer,
  nextQuestion,
  resetSession,
} = sessionsSlice.actions;

export default sessionsSlice.reducer;