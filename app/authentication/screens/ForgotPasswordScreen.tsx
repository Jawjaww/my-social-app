import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { handleError } from '../../../services/errorService';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const Container = styled(View)`
  flex: 1;
  padding: 20px;
  justify-content: center;
`;

const Header = styled(Text)`
  font-size: 24px;
  margin-bottom: 20px;
`;

const ErrorText = styled(Text)`
  color: red;
  margin-bottom: 10px;
`;

const ForgotPasswordScreen: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (!email) {
      setError(t('forgotPassword.error.emailRequired'));
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      Toast.show({
        text1: t('forgotPassword.success'),
        type: 'success',
      });
      navigation.goBack();
    } catch (error) {
      setError(t(handleError(error)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>{t('forgotPassword.title')}</Header>
      <TextInput
        placeholder={t('forgotPassword.emailPlaceholder')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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
        title={t('forgotPassword.button')}
        onPress={handleResetPassword}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </Container>
  );
};

export default ForgotPasswordScreen;