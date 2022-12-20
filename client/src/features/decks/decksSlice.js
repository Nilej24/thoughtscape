import { createSlice } from '@reduxjs/toolkit';

const decksSlice = createSlice({
  name: 'decks',
  initialState: {
    studyDecks: [],
  },
  reducers: {
    setStudyDecks: (state, action) => {
      state.studyDecks = action.payload;
    },
    unsetStudyDecks: (state) => {
      state.studyDecks = [];
    },
  },
});

const selectStudyDecks = state => state.decks.studyDecks;

export { selectStudyDecks };
export const {
  setStudyDecks,
  unsetStudyDecks,
} = decksSlice.actions;
export default decksSlice.reducer;
