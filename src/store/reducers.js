import { combineReducers } from '@reduxjs/toolkit';
import layoutReducer from './layout/layoutSlice';
import authReducer from './auth/authSlice';

const rootReducer = combineReducers({
  layout: layoutReducer,
  auth: authReducer,
});

export default rootReducer;
