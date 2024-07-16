import { atom } from 'recoil';
import { AppUser } from '../authTypes';

// User state for global user
export const userState = atom<AppUser | null>({
  key: 'userState',
  default: null,
});

// Loading state for global loading
export const loadingState = atom<boolean>({
  key: 'loadingState',
  default: true,
});

// Error state for global errors 
export const errorState = atom<string | null>({
  key: 'errorState',
  default: null,
});