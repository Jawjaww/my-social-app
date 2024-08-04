import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSendPasswordResetEmailMutation } from '../../../services/api';

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const [sendPasswordResetEmail, { isLoading }] = useSendPasswordResetEmailMutation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleResetPassword = async () => {
    setError(null);
    setSuccess(false);
    try {
      await sendPasswordResetEmail(email).unwrap();
      setSuccess(true);
    } catch (err) {
      setError(t('forgotPassword.error.generic'));
    }
  };

  return (
    <View>
      <TextInput
        placeholder={t('forgotPassword.emailPlaceholder')}
        value={email}
        onChangeText={setEmail}
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {success && <Text style={{ color: 'green' }}>{t('forgotPassword.success')}</Text>}
      <Button title={t('forgotPassword.button')} onPress={handleResetPassword} disabled={isLoading} />
    </View>
  );
};

export default ForgotPasswordScreen;