import { combineReducers } from '@reduxjs/toolkit';
import layoutReducer from './layout/layoutSlice';

const rootReducer = combineReducers({
  layout: layoutReducer,
});

export default rootReducer;
