import { atom, selector } from 'recoil';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebaseconfig';

// Utiliser directement le type User de Firebase pour userState
export const userState = atom<User | null>({
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
