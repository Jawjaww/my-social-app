import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import styled from "@emotion/native";
import { useNavigation } from "@react-navigation/native";
import { useSignInMutation } from "../../../services/api";
import { MainTabParamList, AuthStackParamList, RootStackParamList } from "../../../navigation/navigationTypes";
import { NavigationProp, CompositeNavigationProp } from "@react-navigation/native";

type SignInScreenNavigationProp = CompositeNavigationProp<
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


function SignInScreen() {
  const [signIn, { isLoading, error }] = useSignInMutation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { t } = useTranslation();
  const navigation = useNavigation<SignInScreenNavigationProp>();  

  const handleSignIn = async () => {
    try {
      await signIn({ email, password }).unwrap();
      navigation.navigate('Main', { screen: 'Message' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Input
        placeholder={t("signIn.emailPlaceholder")}
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder={t("signIn.passwordPlaceholder")}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {error && <ErrorText>{(error as any).data?.message || t("auth.error.generic")}</ErrorText>}
      <Button title={t("signIn.button")} onPress={handleSignIn} disabled={isLoading} />
      <LinkText onPress={() => navigation.navigate('Auth', { screen: 'ForgotPassword' })}>
        {t("signIn.forgotPassword")}
      </LinkText>
      <LinkText onPress={() => navigation.navigate('Auth', { screen: 'SignUp' })}>
        {t("signIn.signUp")}
      </LinkText>
      <LinkText onPress={() => navigation.navigate('Auth', { screen: 'GoogleSignIn' })}>
        {t("signIn.googleSignIn")}
      </LinkText>
      <Button title={t("signIn.back")} onPress={() => navigation.goBack()} />
    </Container>
  );
}

export default SignInScreen;