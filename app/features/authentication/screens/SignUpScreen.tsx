import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import {
  useSignUpMutation,
  useSendVerificationEmailMutation,
} from "../../../services/api";
import {
  AuthStackParamList,
  RootStackParamList,
} from "../../../types/sharedTypes";
import {
  NavigationProp,
  CompositeNavigationProp,
} from "@react-navigation/native";
import { handleAndLogError, AppError } from "../../../services/errorService";
import {
  FormContainer,
  FormInput,
  FormButton,
  FormLinkText,
  FormErrorText,
  FormButtonText,
} from "../../../styles/formStyles";
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

type SignUpScreenNavigationProp = CompositeNavigationProp<
  NavigationProp<AuthStackParamList>,
  NavigationProp<RootStackParamList>
>;

function SignUpScreen() {
  const [signUp, { isLoading }] = useSignUpMutation();
  const [sendVerificationEmail] = useSendVerificationEmailMutation();
  const { t } = useTranslation();
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const schema = yup.object().shape({
    email: yup.string().email(t('auth.error.invalidEmail')).required(t('auth.error.emailRequired')),
    password: yup.string().min(6, t('auth.error.passwordTooShort')).required(t('auth.error.passwordRequired')),
    confirmPassword: yup.string().oneOf([yup.ref('password')], t('auth.error.passwordMismatch')).required(t('auth.error.confirmPasswordRequired')),
  });
  
  const { control, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const user = await signUp(data).unwrap();
      if (user) {
        await sendVerificationEmail().unwrap();
        navigation.navigate("VerifyEmail", { email: data.email });
      } else {
        throw new Error("User creation failed");
      }
    } catch (err) {
      const { message, code } = handleAndLogError(err as AppError, t);
      if (code === 'auth/email-already-in-use') {
        setError('email', { type: 'manual', message: t("errors.auth/email-already-in-use") });
      } else {
        setError('email', { type: 'manual', message });
      }
    }
  };

  return (
    <FormContainer>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder={t("signUp.emailPlaceholder")}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <FormErrorText>{errors.email.message}</FormErrorText>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder={t("signUp.passwordPlaceholder")}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.password && <FormErrorText>{errors.password.message}</FormErrorText>}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder={t("signUp.confirmPasswordPlaceholder")}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.confirmPassword && <FormErrorText>{errors.confirmPassword.message}</FormErrorText>}

      <FormButton onPress={handleSubmit(onSubmit)} disabled={isLoading}>
        <FormButtonText>{t("signUp.button")}</FormButtonText>
      </FormButton>
      <FormLinkText
        onPress={() => navigation.navigate("Auth", { screen: "SignIn" })}
      >
        {t("signUp.alreadyHaveAccount")}
      </FormLinkText>
      <FormLinkText
        onPress={() => navigation.navigate("Auth", { screen: "GoogleSignIn" })}
      >
        {t("signUp.googleSignUp")}
      </FormLinkText>
    </FormContainer>
  );
}

export default SignUpScreen;
