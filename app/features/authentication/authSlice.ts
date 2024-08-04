import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppUser } from './authTypes';

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isEmailVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AppUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isEmailVerified = action.payload?.emailVerified || false;
    },
    setIsEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
      if (state.user) {
        state.user.emailVerified = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, setLoading, setError, setIsEmailVerified } = authSlice.actions;

export default authSlice.reducer;