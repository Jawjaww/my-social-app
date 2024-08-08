import React, { useState } from "react";
import { View, TextInput, Button, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import styled from "@emotion/native";
import { useNavigation } from "@react-navigation/native";
import { useSignInMutation } from "../../../services/api";
import { MainTabParamList, AuthStackParamList, RootStackParamList } from "../../../navigation/AppNavigation";
import { NavigationProp, CompositeNavigationProp } from "@react-navigation/native";
import { handleAndLogError, AppError } from "../../../services/errorService";

type SignInScreenNavigationProp = CompositeNavigationProp<
  NavigationProp<AuthStackParamList>,
  NavigationProp<RootStackParamList>
>;

const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

const Input = styled.TextInput`
  height: 50px;
  border-color: #ddd;
  border-width: 1px;
  margin-bottom: 20px;
  padding-horizontal: 15px;
  width: 100%;
  border-radius: 5px;
  background-color: white;
`;

const ErrorText = styled.Text`
  color: #ff3b30;
  margin-bottom: 15px;
  text-align: center;
`;

const LinkText = styled.Text`
  color: #007aff;
  margin-top: 15px;
`;

const SignInButton = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 15px;
  border-radius: 5px;
  width: 100%;
  align-items: center;
`;

const SignInButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

function SignInScreen() {
  const [signIn, { isLoading }] = useSignInMutation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigation = useNavigation<SignInScreenNavigationProp>();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError(t("auth.error.emptyFields"));
      return;
    }
  
    try {
      await signIn({ email, password }).unwrap();
      navigation.navigate('Main', { screen: 'Messages', params: { screen: 'MessageList' } });
    } catch (err) {
      const errorMessage = handleAndLogError(err as AppError, t);
      setError(errorMessage);
    }
  };

  return (
    <Container>
      <Input
        placeholder={t("signIn.emailPlaceholder")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder={t("signIn.passwordPlaceholder")}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <SignInButton onPress={handleSignIn} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <SignInButtonText>{t("signIn.button")}</SignInButtonText>
        )}
      </SignInButton>
      <TouchableOpacity onPress={() => navigation.navigate('Auth', { screen: 'ForgotPassword' })}>
        <LinkText>{t("signIn.forgotPassword")}</LinkText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Auth', { screen: 'SignUp' })}>
        <LinkText>{t("signIn.signUp")}</LinkText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Auth', { screen: 'GoogleSignIn' })}>
        <LinkText>{t("signIn.googleSignIn")}</LinkText>
      </TouchableOpacity>
    </Container>
  );
}

export default SignInScreen;