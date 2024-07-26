import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import styled from '@emotion/native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { handleError } from '../../../services/errorService';

const Container = styled(View)`
  flex: 1;
  padding: 20px;
  justify-content: center;
`;

const Header = styled(Text)`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const ErrorText = styled(Text)`
  color: red;
  margin-bottom: 10px;
`;

const ResetPasswordScreen: React.FC<{ route: any }> = ({ route }) => {
  const { t } = useTranslation();
  const { oobCode } = route.params; // Get the code from the URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setError(null);
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError(t("resetPassword.error.mismatch"));
      setIsLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, newPassword);
      Toast.show({
        text1: t('resetPassword.successUpdate'), 
        type: 'success',
      });
    } catch (error) {
      setError(t(handleError(error)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>{t('resetPassword.newPasswordTitle')}</Header>
      <TextInput
        placeholder={t('resetPassword.newPassword')}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
      />
      <TextInput
        placeholder={t('resetPassword.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <Button
        title={t('resetPassword.submitButton')}
        onPress={handleResetPassword}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </Container>
  );
};

export default ResetPasswordScreen;