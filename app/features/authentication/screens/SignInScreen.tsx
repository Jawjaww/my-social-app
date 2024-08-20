import React from "react";
import { ActivityIndicator } from "react-native";
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
  FormContainer,
  FormInput,
  FormButton,
  FormButtonText,
  FormLinkText,
  FormErrorText,
} from "../../../styles/formStyles";
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
    try {
      const result = await signIn(data).unwrap();
      if (result.isAuthenticated)  {
        dispatch(addToast({ message: t("auth.signIn.success"), type: "success" }));
        navigation.navigate("Main", { screen: "Home" });
      } else {
        throw new Error("User creation failed");
      }
    } catch (err: any) {
      const { message, code } = handleAndLogError(err as AppError, t);
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
      <FormContainer>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
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
          <FormErrorText>{t(errors.email.message as string)}</FormErrorText>
        )}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
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
          <FormErrorText>{t(errors.password.message as string)}</FormErrorText>
        )}

        <FormButton onPress={handleSubmit(onSubmit)} disabled={isLoading}>
          <FormButtonText>{t("auth.signIn.button")}</FormButtonText>
        </FormButton>
        {isLoading && <ActivityIndicator color={theme.colors.primary} />}

        <FormLinkText onPress={() => navigation.navigate("ForgotPassword")}>
          {t("auth.signIn.forgotPassword")}
        </FormLinkText>

        <FormLinkText onPress={() => navigation.navigate("SignUp")}>
          {t("auth.signIn.noAccount")}
        </FormLinkText>
      </FormContainer>
  );
};

export default SignInScreen;
