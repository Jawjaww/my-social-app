import React, { useState } from 'react';
import { Button, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import styled from '@emotion/native';
import { handleError } from '../../../services/errorService'; 
import useAuthService from '../useAuthServices'; 
import { NavigationProp, useNavigation } from '@react-navigation/native'; 
import { RootStackParamList } from '../../navigation/navigationTypes'; 

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Header = styled.Text`
  font-size: 24px;
  margin-bottom: 20px;
`;

const TextInput = styled.TextInput`
  height: 40px;
  border-color: gray;
  border-width: 1px;
  margin-bottom: 20px;
  padding-horizontal: 10px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 20px;
`;

const ResetPasswordScreen: React.FC<{ route: any }> = ({ route }) => {
  const { t } = useTranslation();
  const { oobCode } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); 
  const authService = useAuthService();
  

  const handleResetPassword = async () => {
    setError(null);
    setIsLoading(true);

    if (newPassword.length < 6) {
      setError(t("resetPassword.error.shortPassword"));
      setIsLoading(false);
      return;
    }

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
      navigation.navigate('SignIn'); 
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
      />
      <TextInput
        placeholder={t('resetPassword.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
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