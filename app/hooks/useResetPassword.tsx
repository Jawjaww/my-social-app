import { useState } from 'react';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { handleError } from '../../services/errorService';
import { useTranslation } from 'react-i18next';

const useResetPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (oobCode: string, newPassword: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, newPassword);
      return { success: true, message: t('resetPassword.success') };
    } catch (error) {
      setError(t(handleError(error)));
      return { success: false, message: t('resetPassword.error') };
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, error, isLoading, handleResetPassword };
};

export default useResetPassword;