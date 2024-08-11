import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import { useNavigation } from "@react-navigation/native";
import { useSignInMutation } from "../../../services/api";
import { NavigationProp } from "@react-navigation/native";
import { handleAndLogError, AppError } from "../../../services/errorService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  AuthStackParamList,
  RootStackParamList,
} from "../../../types/sharedTypes";
import { useDispatch } from "react-redux";
import { addToast } from "../../../features/toast/toastSlice";
import { useForm, Controller } from "react-hook-form";
import {
  AuthContainer,
  AuthInput,
  AuthButton,
  AuthButtonText,
  AuthLinkText,
} from "../../../styles/authStyles";
import styled from "@emotion/native";

type SignInScreenNavigationProp = NavigationProp<
  AuthStackParamList & RootStackParamList
>;

console.log("SignInScreen module loaded");

const schema = yup.object().shape({
  email: yup
    .string()
    .email("common.errors.invalidEmail")
    .required("common.errors.required"),
  password: yup.string().required("common.errors.required"),
});

const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
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

const SignInScreen: React.FC = (props) => {
  console.log("SignInScreen component rendering");
  console.log("SignInScreen props:", props);
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const [signIn, { isLoading }] = useSignInMutation();
  const dispatch = useDispatch();

  console.log("SignInScreen hooks initialized");

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    console.log("Submitting form with data:", data);
    try {
      await signIn(data).unwrap();
      console.log("Sign in successful");
      navigation.navigate("Main", { screen: "Home" });
    } catch (error: any) {
      console.error("Sign in error:", error);
      const { message, code } = handleAndLogError(error as AppError, t);
      switch (code) {
        case "auth/invalid-email":
        case "auth/user-disabled":
        case "auth/user-not-found":
          setError("email", {
            type: "manual",
            message: t(`errors.${code}`),
          });
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("password", {
            type: "manual",
            message: t(`errors.${code}`),
          });
          break;
        case "auth/network-request-failed":
          dispatch(addToast({ message: t(`errors.${code}`), type: "error" }));
          break;
        default:
          dispatch(addToast({ message, type: "error" }));
      }
    }
  };

  console.log("Rendering SignInScreen components");
  console.log("SignInScreen state:", { isLoading });

  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Container>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("common.placeholders.email")}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
          name="email"
        />
        {errors.email && (
          <ErrorText>{t(errors.email.message as string)}</ErrorText>
        )}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("common.placeholders.password")}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
          name="password"
        />
        {errors.password && (
          <ErrorText>{t(errors.password.message as string)}</ErrorText>
        )}

        <AuthButton onPress={handleSubmit(onSubmit)} disabled={isLoading}>
          <AuthButtonText>{t("auth.signIn.button")}</AuthButtonText>
        </AuthButton>
        {isLoading && <ActivityIndicator color={theme.colors.primary} />}

        <LinkText onPress={() => navigation.navigate("ForgotPassword")}>
          {t("auth.signIn.forgotPassword")}
        </LinkText>

        <LinkText onPress={() => navigation.navigate("SignUp")}>
          {t("auth.signIn.noAccount")}
        </LinkText>
      </Container>
    </View>
  );
};

export default SignInScreen;
