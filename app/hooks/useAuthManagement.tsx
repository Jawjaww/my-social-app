import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { userState } from '../authentication/recoil/authAtoms';
import useAuthService from '../authentication/useAuthServices';
import { handleError } from '../../services/errorService';

const useAuthManagement = () => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

  const signIn = async (email: string, password: string) => {
    try {
      await authService.signIn(email, password);
      setSuccess(t('auth.success.signIn'));
      await reloadUser();
    } catch (error) {
      setError(t('auth.error.signIn'));
      console.error(t('auth.error.signIn'), handleError(error));
    }
  };

  const signOutUser = async () => {
    try {
      await authService.signOutUser();
      setUser(null);
      setSuccess(t('auth.success.signOut'));
    } catch (error) {
      setError(t('auth.error.signOut'));
      console.error(t('auth.error.signOut'), handleError(error));
    }
  };

  const createUser = async (email: string, password: string) => {
    try {
      const userCredentials = await authService.createUser(email, password);
      await authService.sendVerificationEmail(userCredentials.user);
      setSuccess(t('auth.success.signUp'));
      await reloadUser();
    } catch (error) {
      setError(t('auth.error.signUp'));
      console.error(t('auth.error.signUp'), handleError(error));
    }
  };

  return { signIn, signOutUser, createUser, sendVerificationEmail: authService.sendVerificationEmail, reloadUser, error, success, user, setError };
};

export default useAuthManagement;