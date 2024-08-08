import React, { useState } from "react";
import { Button, Text } from "react-native";
import { useTranslation } from "react-i18next";
import styled from "@emotion/native";
import { useNavigation } from "@react-navigation/native";
import {
  useSignUpMutation,
  useSendVerificationEmailMutation,
} from "../../../services/api";
import {
  MainTabParamList,
  AuthStackParamList,
  RootStackParamList,
} from "../../../navigation/AppNavigation";
import {
  NavigationProp,
  CompositeNavigationProp,
} from "@react-navigation/native";
import Toast from "../../../components/Toast";
import { handleAndLogError, AppError } from "../../../services/errorService";

type SignUpScreenNavigationProp = CompositeNavigationProp<
  NavigationProp<AuthStackParamList>,
  NavigationProp<RootStackParamList>
>;

const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const Input = styled.TextInput`
  height: 40px;
  border-color: gray;
  border-width: 1px;
  margin-bottom: 20px;
  padding-horizontal: 10px;
  width: 100%;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
`;

const LinkText = styled.Text`
  color: blue;
  margin-top: 10px;
  text-decoration: underline;
`;

function SignUpScreen() {
  const [signUp, { isLoading }] = useSignUpMutation();
  const [sendVerificationEmail, { isLoading: isSendingVerificationEmail }] =
    useSendVerificationEmailMutation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { t } = useTranslation();
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError(t("auth.error.passwordMismatch"));
      return;
    }
    try {
      const user = await signUp({ email, password }).unwrap();
      if (user) {
        await sendVerificationEmail().unwrap();
        navigation.navigate("VerifyEmail", { oobCode: undefined });
      } else {
        throw new Error("User creation failed");
      }
    } catch (err) {
      const errorMessage = handleAndLogError(err as AppError, t);
      setError(errorMessage);
    }
  };

  return (
    <Container>
      <Input
        placeholder={t("signUp.emailPlaceholder")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder={t("signUp.passwordPlaceholder")}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Input
        placeholder={t("signUp.confirmPasswordPlaceholder")}
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <Button
        title={t("signUp.button")}
        onPress={handleSignUp}
        disabled={isLoading}
      />
      <LinkText
        onPress={() => navigation.navigate("Auth", { screen: "SignIn" })}
      >
        {t("signUp.alreadyHaveAccount")}
      </LinkText>
      <LinkText
        onPress={() => navigation.navigate("Auth", { screen: "GoogleSignIn" })}
      >
        {t("signUp.googleSignUp")}
      </LinkText>
      <Button title={t("signUp.back")} onPress={() => navigation.goBack()} />
    </Container>
  );
}

export default SignUpScreen;
