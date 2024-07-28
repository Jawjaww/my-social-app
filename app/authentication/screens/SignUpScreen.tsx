import React, { useState } from 'react';
import { Button } from 'react-native';
import styled from '@emotion/native';
import { useTranslation } from 'react-i18next';
import useAuthActions from '../../hooks/useAuthActions';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Input = styled.TextInput`
  height: 40px;
  border-color: gray;
  border-width: 1px;
  margin-bottom: 20px;
  padding-horizontal: 10px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
`;

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { createUser } = useAuthActions();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError(t("auth.error.passwordMismatch"));
      return;
    }
    await createUser(email, password);
    navigation.navigate('Auth', { screen: 'VerifyEmail' });
  };

  return (
    <Container>
      <Input placeholder={t("editEmail.newEmail")} value={email} onChangeText={setEmail} />
      <Input placeholder={t("editEmail.currentPassword")} value={password} secureTextEntry onChangeText={setPassword} />
      <Input placeholder={t("editEmail.confirmEmail")} value={confirmPassword} secureTextEntry onChangeText={setConfirmPassword} />
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button title={t("signUp.title")} onPress={handleSignUp} />
    </Container>
  );
};

export default SignUpScreen;