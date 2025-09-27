import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTab: "interviewee",
  activeCandidateId: null,
  welcomeBackModal: {
    visible: false,
    candidateId: null,
  },
  networkStatus: "online",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCurrentTab(state, action) {
      state.currentTab = action.payload;
    },
    setActiveCandidate(state, action) {
      state.activeCandidateId = action.payload;
    },
    showWelcomeBack(state, action) {
      state.welcomeBackModal = {
        visible: true,
        candidateId: action.payload,
      };
    },
    hideWelcomeBack(state) {
      state.welcomeBackModal = {
        visible: false,
        candidateId: null,
      };
    },
    setNetworkStatus(state, action) {
      state.networkStatus = action.payload;
    },
  },
});

export const {
  setCurrentTab,
  setActiveCandidate,
  showWelcomeBack,
  hideWelcomeBack,
  setNetworkStatus,
} = uiSlice.actions;

export default uiSlice.reducer;
