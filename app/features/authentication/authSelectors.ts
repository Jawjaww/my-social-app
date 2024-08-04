import { RootState } from '../../store';
import { AppUser } from './authTypes';

export const selectUser = (state: RootState): AppUser | null => state.auth.user;
export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;
export const selectIsEmailVerified = (state: RootState): boolean => state.auth.isEmailVerified;
export const selectAuthLoading = (state: RootState): boolean => state.auth.loading;
export const selectAuthError = (state: RootState): string | null => state.auth.error;