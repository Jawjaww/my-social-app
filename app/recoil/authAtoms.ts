import { atom } from 'recoil';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const userState = atom<AppUser | null>({
  key: 'userState',
  default: null,
});
