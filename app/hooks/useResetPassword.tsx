import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { handleError } from '../../services/errorService';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

const useResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleResetPassword = async () => {
    setError(null);
    setIsLoading(true);

    if (!email) {
      setError(t('resetPassword.error.notAuthenticated'));
      setIsLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      Toast.show({
        text1: t('resetPassword.success'), 
        type: 'success',
      });
    } catch (error) {
      setError(t(handleError(error)));
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, error, isLoading, handleResetPassword };
};

export default useResetPassword;