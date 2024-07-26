import React, { useState } from 'react';
import { Button } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { handleError } from '../../../services/errorService';
import styled from '@emotion/native';
import { app } from '../../../services/firebaseConfig';
import { SignUpScreenProps } from '../../navigation/navigationTypes';
import { useTranslation } from 'react-i18next';

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

function SignUpScreen({ navigation }: SignUpScreenProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth(app);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError(t("auth.error.passwordMismatch"));
      return;
    }
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredentials.user);
      navigation.navigate("SignIn");
    } catch (error) {
      setError(handleError(error));
    }
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
}

export default SignUpScreen;