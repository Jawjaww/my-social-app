// app/recoil/authAtoms.ts
import { atom, selector } from 'recoil';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebaseconfig';

export const userState = atom({
  key: 'userState',
  default: null,
});

export const userAuthState = selector({
  key: 'userAuthState',
  get: async ({ get }) => {
    const user = get(userState);
    if (user) return { user, loading: false };
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve({ user, loading: false });
      });
    });
  },
});
