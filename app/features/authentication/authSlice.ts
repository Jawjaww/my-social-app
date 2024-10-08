import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppUser } from "../../types/sharedTypes";
interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isEmailVerified: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state: AuthState, action: PayloadAction<AppUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isEmailVerified = action.payload?.emailVerified || false;
    },
    setIsEmailVerified: (state: AuthState, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
      if (state.user) {
        state.user.emailVerified = action.payload;
      }
    },
    setLoading: (state: AuthState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: AuthState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setUser, 
  setIsEmailVerified, 
  setLoading, 
  setError, 
} = authSlice.actions;

export default authSlice.reducer;