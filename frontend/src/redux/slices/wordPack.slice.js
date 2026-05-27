import { createSlice } from '@reduxjs/toolkit';

const defaultPackInfo = {
  type: '-1',
  level: '-1',
  specialty: '-1',
  topics: [],
};

const wordPackSlice = createSlice({
  name: 'wordPack',
  initialState: {
    packInfo: defaultPackInfo,
    isChosen: false, // đã chọn chủ đề chưa
  },
  reducers: {
    setWordPack: (state, action) => {
      state.packInfo = action.payload;
      state.isChosen = true;
    },
    resetWordPack: (state) => {
      state.packInfo = defaultPackInfo;
      state.isChosen = false;
    },
  },
});

export const { setWordPack, resetWordPack } = wordPackSlice.actions;
export default wordPackSlice.reducer;