import useAuthService from './useAuthServices';
import { applyActionCode } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

const useVerifyEmail = () => {
  const authService = useAuthService();
  const { t } = useTranslation();

  const verifyEmail = async (oobCode: string) => {
    console.log("useVerifyEmail: Attempting to verify email with oobCode:", oobCode);
    try {
      await applyActionCode(authService.auth, oobCode);
      console.log("useVerifyEmail: Email verification successful");
      return { success: true, message: t('verifyEmail.success') };
    } catch (error: any) {
      console.error("useVerifyEmail: Email verification failed", error);
      console.log("Error code:", error.code);
      console.log("Error message:", error.message);
      if (error.code === 'auth/invalid-action-code') {
        console.log("Le lien de vérification a expiré ou a déjà été utilisé");
        return { success: false, message: t('verifyEmail.linkExpired') };
      }
      const errorMessage = error.code ? t(`errors.${error.code}`) : t('verifyEmail.error');
      return { success: false, message: errorMessage };
    } finally {
      console.log("useVerifyEmail: Verification process completed");
    }
  };

  return { verifyEmail };
};

export default useVerifyEmail;