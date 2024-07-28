import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthService from '../authentication/useAuthServices';
import { handleError } from '../../services/errorService';
import { User, applyActionCode } from 'firebase/auth';
import useReloadUser from './useReloadUser';

const useAuthActions = () => {
  const { t } = useTranslation();
  const { reloadUser } = useReloadUser();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const authService = useAuthService();

  const createUser = async (email: string, password: string) => {
    try {
      await authService.createUser(email, password);
      setSuccess(t('auth.success.signUp'));
      await reloadUser();
    } catch (error) {
      setError(t('auth.error.signUp'));
      console.error(t('auth.error.signUp'), handleError(error));
    }
  };

  const sendVerificationEmail = async (user: User) => {
    try {
      await authService.sendVerificationEmail(user);
    } catch (error) {
      setError(t('auth.error.verificationEmail'));
      console.error(t('auth.error.verificationEmail'), handleError(error));
    }
  };

  const signIn = async (email: string, password: string, oobCode?: string) => {
    try {
      await authService.signIn(email, password);
      setSuccess(t('auth.success.signIn'));

      if (oobCode) {
        console.log("Applying oobCode:", oobCode);
        await applyActionCode(authService.auth, oobCode);
        console.log("oobCode applied successfully.");
      }

      await reloadUser();
      if (authService.auth.currentUser?.emailVerified) {
        console.log("User is verified, navigating to Message.");
        // navigation logic should be handled outside of this hook
      } else {
        setError(t('auth.error.emailNotVerified'));
        console.log("User email is not verified.");
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      switch (error.code) {
        case 'auth/invalid-email':
          setError(t('auth.error.invalidEmail'));
          break;
        case 'auth/user-disabled':
          setError(t('auth.error.userDisabled'));
          break;
        case 'auth/user-not-found':
          setError(t('auth.error.userNotFound'));
          break;
        case 'auth/wrong-password':
          setError(t('auth.error.wrongPassword'));
          break;
        case 'auth/invalid-credential':
          setError(t('auth.error.invalidCredential'));
          break;
        case 'auth/too-many-requests':
          setError(t('auth.error.tooManyRequests'));
          break;
        default:
          setError(t('auth.error.signIn'));
      }
    }
  };

  return { createUser, sendVerificationEmail, signIn, error, success };
};

export default useAuthActions;
