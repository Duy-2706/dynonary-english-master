import { createSlice } from '@reduxjs/toolkit';

const studySessionSlice = createSlice({
  name: 'studySession',
  initialState: {
    topic: null,        // chủ đề đang học { key, title, icon }
    wordList: [],       // toàn bộ từ của chủ đề
    knownWords: [],     // từ đã biết
    unknownWords: [],   // từ chưa biết
    isStudying: false,  // đang học không
    isDone: false,      // học xong chưa
  },
  reducers: {
    startSession: (state, action) => {
      state.topic = action.payload.topic;
      state.wordList = action.payload.wordList;
      state.knownWords = [];
      state.unknownWords = [];
      state.isStudying = true;
      state.isDone = false;
    },
    markKnown: (state, action) => {
      state.knownWords.push(action.payload);
    },
    markUnknown: (state, action) => {
      state.unknownWords.push(action.payload);
    },
    finishSession: (state) => {
      state.isDone = true;
      state.isStudying = false;
    },
    resetSession: (state) => {
      state.knownWords = [];
      state.unknownWords = [];
      state.isStudying = true;
      state.isDone = false;
    },
  },
});

export const {
  startSession,
  markKnown,
  markUnknown,
  finishSession,
  resetSession,
} = studySessionSlice.actions;

export default studySessionSlice.reducer;