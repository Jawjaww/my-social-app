import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../../navigation/AppNavigation';
import { useResetPasswordMutation } from '../../../services/api';

type ResetPasswordScreenRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;

type Props = {
  route: ResetPasswordScreenRouteProp;
};

const ResetPasswordScreen: React.FC<Props> = ({ route }) => {
  const { oobCode } = route.params;
  const { t } = useTranslation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleResetPassword = async () => {
    setError(null);
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError(t('resetPassword.error.mismatch'));
      return;
    }
    try {
      await resetPassword({ oobCode, newPassword }).unwrap();
      setSuccess(true);
    } catch (err) {
      setError(t('resetPassword.error.generic'));
    }
  };

  return (
    <View>
      <TextInput
        placeholder={t('resetPassword.newPassword')}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        placeholder={t('resetPassword.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {success && <Text style={{ color: 'green' }}>{t('resetPassword.success')}</Text>}
      <Button title={t('resetPassword.button')} onPress={handleResetPassword} disabled={isLoading} />
    </View>
  );
};

export default ResetPasswordScreen;