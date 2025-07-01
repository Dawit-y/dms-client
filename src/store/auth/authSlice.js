import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  userData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.userData = action.payload.userData;
    },
    clearAuthData: (state) => {
      state.accessToken = null;
      state.userData = null;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;

export default authSlice.reducer;
