import { createSlice, nanoid } from "@reduxjs/toolkit";

/*
State shape:
sessions: {
  byId: {
    candidateId: {
      id,
      createdAt,
      updatedAt,
      profile: { name, email, phone, resumeFileName, resumeText },
      interview: {
        role,
        questions: [],
        currentQuestionIndex,
        status, // not_started | in_progress | paused | finished
        finalScore,
        summary,
        progressMeta: { startedAt, lastActiveAt, pausedAt }
      }
    }
  },
  allIds: []
}
*/

const initialState = {
  byId: {},
  allIds: [],
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    createCandidate: {
      reducer(state, action) {
        const candidate = action.payload;
        state.byId[candidate.id] = candidate;
        state.allIds.push(candidate.id);
      },
      prepare(profile = {}) {
        return {
          payload: {
            id: nanoid(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            profile: {
              name: profile.name || null,
              email: profile.email || null,
              phone: profile.phone || null,
              resumeFileName: profile.resumeFileName || null,
              resumeText: profile.resumeText || null,
            },
            interview: {
              role: null,
              questions: [],
              currentQuestionIndex: -1,
              status: "not_started",
              finalScore: null,
              summary: null,
              progressMeta: {
                startedAt: null,
                lastActiveAt: null,
                pausedAt: null,
              },
            },
          },
        };
      },
    },

    updateProfile(state, action) {
      const { id, updates } = action.payload;
      if (state.byId[id]) {
        state.byId[id].profile = {
          ...state.byId[id].profile,
          ...updates,
        };
        state.byId[id].updatedAt = Date.now();
      }
    },

    startInterview(state, action) {
      const { id, role, questions } = action.payload;
      if (state.byId[id]) {
        state.byId[id].interview = {
          ...state.byId[id].interview,
          role,
          questions,
          currentQuestionIndex: 0,
          status: "in_progress",
          progressMeta: {
            ...state.byId[id].interview.progressMeta,
            startedAt: Date.now(),
          },
        };
        state.byId[id].updatedAt = Date.now();
      }
    },

    pauseInterview(state, action) {
      const { id } = action.payload;
      if (state.byId[id]) {
        state.byId[id].interview.status = "paused";
        state.byId[id].interview.progressMeta.pausedAt = Date.now();
        state.byId[id].updatedAt = Date.now();
      }
    },

    resumeInterview(state, action) {
      const { id } = action.payload;
      if (state.byId[id]) {
        state.byId[id].interview.status = "in_progress";
        state.byId[id].interview.progressMeta.lastActiveAt = Date.now();
        state.byId[id].updatedAt = Date.now();
      }
    },

    submitAnswer(state, action) {
      const { id, questionIndex, answer } = action.payload;
      const candidate = state.byId[id];
      if (candidate && candidate.interview.questions[questionIndex]) {
        candidate.interview.questions[questionIndex].answer = {
          text: answer,
          submittedAt: Date.now(),
          autoSubmitted: false,
        };
        candidate.updatedAt = Date.now();
      }
    },

    autoSubmitAnswer(state, action) {
      const { id, questionIndex } = action.payload;
      const candidate = state.byId[id];
      if (candidate && candidate.interview.questions[questionIndex]) {
        candidate.interview.questions[questionIndex].answer = {
          text: candidate.interview.questions[questionIndex].answer?.text || "",
          submittedAt: Date.now(),
          autoSubmitted: true,
        };
        candidate.updatedAt = Date.now();
      }
    },

    nextQuestion(state, action) {
      const { id } = action.payload;
      const candidate = state.byId[id];
      if (candidate) {
        candidate.interview.currentQuestionIndex += 1;
        candidate.updatedAt = Date.now();
      }
    },

    finishInterview(state, action) {
      const { id, finalScore, summary } = action.payload;
      if (state.byId[id]) {
        state.byId[id].interview.status = "finished";
        state.byId[id].interview.finalScore = finalScore;
        state.byId[id].interview.summary = summary;
        state.byId[id].updatedAt = Date.now();
      }
    },
  },
});

export const {
  createCandidate,
  updateProfile,
  startInterview,
  pauseInterview,
  resumeInterview,
  submitAnswer,
  autoSubmitAnswer,
  nextQuestion,
  finishInterview,
} = sessionsSlice.actions;

export default sessionsSlice.reducer;
