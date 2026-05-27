import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './slices/message.slice';
import userInfoReducer from './slices/userInfo.slice';
import voiceReducer from './slices/voice.slice';
import wordPackReducer from './slices/wordPack.slice';
import studySessionReducer from './slices/studySession.slice';

const store = configureStore({
  reducer: {
    message: messageReducer,
    userInfo: userInfoReducer,
    voice: voiceReducer,
    wordPack: wordPackReducer,
    studySession: studySessionReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;