import React from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import useResetPassword from '../../hooks/useResetPassword';
import styled from '@emotion/native';
import { useTranslation } from 'react-i18next';

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

const RequestResetPasswordScreen: React.FC = () => {
  const { t } = useTranslation();
  const { email, setEmail, error, isLoading, handleResetPassword } = useResetPassword();

  return (
    <Container>
      <Header>{t('resetPassword.title')}</Header>
      <TextInput
        placeholder={t('resetPassword.emailPlaceholder')}
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
        title={t('resetPassword.button')}
        onPress={handleResetPassword}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </Container>
  );
};

export default RequestResetPasswordScreen;