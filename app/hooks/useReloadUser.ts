import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../authentication/recoil/authAtoms';
import useAuthService from '../authentication/useAuthServices';
import { handleError } from '../../services/errorService';
import { User } from 'firebase/auth';

const useReloadUser = () => {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useRecoilState(userState);
  const authService = useAuthService();

  const reloadUser = async () => {
    const currentUser = authService.auth.currentUser;

    if (currentUser) {
      try {
        await currentUser.reload();
        const updatedUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          emailVerified: currentUser.emailVerified,
        };
        setUser(updatedUser);
      } catch (error) {
        setError(handleError(error));
      }
    }
  };

  return { reloadUser, user, error };
};

export default useReloadUser;