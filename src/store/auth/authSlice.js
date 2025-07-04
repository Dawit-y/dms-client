import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  userData: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userData = action.payload.userData;
      state.isAuthenticated = true;
    },
    clearAuthData: (state) => {
      state.accessToken = null;
      state.userData = null;
      state.isAuthenticated = false;
    },
  },
});

const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth?.isAuthenticated
);
export const selectUserData = createSelector(
  [selectAuth],
  (auth) => auth?.userData
);
export const selectAccessToken = createSelector(
  [selectAuth],
  (auth) => auth?.accessToken
);

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
