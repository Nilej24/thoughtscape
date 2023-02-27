import { createSlice } from '@reduxjs/toolkit';

const initialUser = JSON.parse(localStorage.getItem('user'));

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    user: initialUser,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    unsetUser: (state) => {
      state.user = null;
    },
  },
});

const selectUser = state => state.users.user;
const selectUserToken = state => state?.users?.user?.token;

export const { setUser, unsetUser } = usersSlice.actions;
export { selectUser, selectUserToken };
export default usersSlice.reducer;
