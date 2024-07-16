import { atom } from 'recoil';
import { AppUser } from '../../authentication/authTypes';

export const profileState = atom<AppUser | null>({
  key: 'profileState',
  default: null,
});
