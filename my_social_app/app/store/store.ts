import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../services/api";
import rootReducer from "./rootReducer";
import { ThunkAction, Action } from "@reduxjs/toolkit";
import type { RootState } from './rootReducer';

const loadState = async () => {
  try {
    const serializedState = await AsyncStorage.getItem("appState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = async (state: RootState) => {
  try {
    const serializedState = JSON.stringify({
      auth: state.auth,
      profile: state.profile,
      contacts: state.contacts,
    });
    await AsyncStorage.setItem("appState", serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

// Create store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(api.middleware),
});

export const initializeStore = async () => {
  try {
    console.log('🔄 Configuring Redux store...');
    
    const preloadedState = await loadState();
    
    if (preloadedState) {
      store.dispatch({ type: 'HYDRATE', payload: preloadedState });
    }

    console.log('✅ Redux store configured successfully');
    
    // Set up store subscription to save state
    store.subscribe(() => {
      saveState(store.getState());
    });

    // Set up listeners for RTK Query
    setupListeners(store.dispatch);

    return store;
  } catch (error) {
    console.error('❌ Store initialization error:', error);
    if (error instanceof Error) {
      console.error('❌ Store error stack:', error.stack);
    }
    throw error;
  }
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;
// Reexport RootState type from rootReducer
export type { RootState };
// Define the AppThunk type
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
