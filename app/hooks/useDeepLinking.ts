import { useEffect } from 'react';
import { Linking } from 'react-native';
import { applyActionCode, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import useAuthManagement from './useAuthManagement';

const useDeepLinking = (onSuccess: (message: string) => void, onError: (message: string) => void) => {
  const { reloadUser } = useAuthManagement();

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      const parsedUrl = new URL(url);
      const mode = parsedUrl.searchParams.get("mode");
      const oobCode = parsedUrl.searchParams.get("oobCode");

      if (mode === "verifyEmail" && oobCode) {
        try {
          await applyActionCode(auth, oobCode);
          await reloadUser(); // Reload user after email verification
          onSuccess('Email verified successfully');
        } catch (error) {
          onError('Error verifying email');
        }
      }
      if (mode === "resetPassword" && oobCode) {
        try {
          // Logique pour réinitialiser le mot de passe
          await sendPasswordResetEmail(auth, oobCode);
          await reloadUser(); // Reload user after email verification
          onSuccess('Password reset successfully');
        } catch (error) {
          onError('Error resetting password');
        }
      }
    };

    const unsubscribe = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));

    return () => {
      unsubscribe.remove();
    };
  }, [onSuccess, onError]);
};

export default useDeepLinking;