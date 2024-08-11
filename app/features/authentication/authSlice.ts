import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppUser } from "../../types/sharedTypes";

interface AuthState {
  user: Omit<AppUser, "stsTokenManager"> | null;
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
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AppUser | null>) => {
      if (action.payload) {
        state.user = {
          ...action.payload,
          username: action.payload.username || action.payload.email?.split("@")[0] || 'Anonymous',
        };
        state.isAuthenticated = true;
        state.isEmailVerified = action.payload.emailVerified;
      } else {
        state.user = null;
        state.isAuthenticated = false;
        state.isEmailVerified = false;
      }
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

export const { setUser, setLoading, setError, setIsEmailVerified } =
  authSlice.actions;

export default authSlice.reducer;
