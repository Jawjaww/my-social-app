import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

interface ProfileState {
  email: string | null;
  isUpdatingEmail: boolean;
  emailUpdateError: string | null;
  isResettingPassword: boolean;
  resetPasswordError: string | null;
  resetPasswordSuccess: boolean;
  pendingNewEmail: string | null;
}

const initialState: ProfileState = {
  email: null,
  isUpdatingEmail: false,
  emailUpdateError: null,
  isResettingPassword: false,
  resetPasswordError: null,
  resetPasswordSuccess: false,
  pendingNewEmail: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
    },
    setIsUpdatingEmail: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingEmail = action.payload;
    },
    setEmailUpdateError: (state, action: PayloadAction<string | null>) => {
      state.emailUpdateError = action.payload;
    },
    setIsResettingPassword: (state, action: PayloadAction<boolean>) => {
      state.isResettingPassword = action.payload;
    },
    setResetPasswordError: (state, action: PayloadAction<string | null>) => {
      state.resetPasswordError = action.payload;
    },
    setResetPasswordSuccess: (state, action: PayloadAction<boolean>) => {
      state.resetPasswordSuccess = action.payload;
    },
    setPendingNewEmail: (state, action: PayloadAction<string | null>) => {
      state.pendingNewEmail = action.payload;
    },
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
});

export const {
  setEmail,
  setIsUpdatingEmail,
  setEmailUpdateError,
  setIsResettingPassword,
  setResetPasswordError,
  setResetPasswordSuccess,
  setPendingNewEmail,
  setUserEmail,
} = profileSlice.actions;

export const selectPendingNewEmail = (state: RootState) => state.profile.pendingNewEmail;

export default profileSlice.reducer;