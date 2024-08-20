import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '../services/api';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware as any),
});

// Configure Redux DevTools
// if (process.env.NODE_ENV !== 'production') {
//   const { composeWithDevTools } = require('redux-devtools-extension');
//   store.dispatch = composeWithDevTools(store.dispatch);
// }

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
