import React, { useState } from 'react';
import { Button, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/native';
import useAuthManagement from '../../hooks/useAuthManagement';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigationTypes';

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

function SignInScreen() {
  const { signIn, error } = useAuthManagement();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSignIn = async () => {
    await signIn(email, password);
  };

  return (
    <Container>
      <Input
        placeholder={t('signIn.emailPlaceholder')}
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder={t('signIn.passwordPlaceholder')}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <Button title={t('signIn.button')} onPress={handleSignIn} />
      <Button
        title={t('signIn.forgotPassword')}
        onPress={() => navigation.navigate('ForgotPassword')}
      />
    </Container>
  );
}

export default SignInScreen;