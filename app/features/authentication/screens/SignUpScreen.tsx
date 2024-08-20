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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FormContainer,
  FormInput,
  FormButton,
  FormButtonText,
  FormErrorText,
  FormLinkText,
} from "../../../styles/formStyles";
import { handleAndLogError, AppError } from "../../../services/errorService";
import { useDispatch } from "react-redux";
import { addToast } from "../../toast/toastSlice";

type SignUpScreenNavigationProp = CompositeNavigationProp<
  NavigationProp<AuthStackParamList>,
  NavigationProp<RootStackParamList>
>;

const schema = yup.object().shape({
  email: yup
    .string()
    .email("signUp.error.invalidEmail")
    .required("common.errors.required"),
  password: yup
    .string()
    .min(6, "signUp.error.passwordTooShort")
    .required("common.errors.required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "signUp.error.passwordMismatch")
    .required("common.errors.required"),
});

function SignUpScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [signUp, { isLoading }] = useSignUpMutation();
  const [sendVerificationEmail] = useSendVerificationEmailMutation();
  const dispatch = useDispatch();
  const [tempErrors, setTempErrors] = useState<
    Record<string, string | undefined>
  >({});

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const showTempError = (field: string, message: string) => {
    setTempErrors((prev) => ({ ...prev, [field]: message }));
    setTimeout(() => {
      setTempErrors((prev) => ({ ...prev, [field]: undefined }));
    }, 5000); // Error will disappear after 5 seconds
  };

  const onSubmit = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const user = await signUp({
        email: data.email,
        password: data.password,
      }).unwrap();
      if (user) {
        await sendVerificationEmail().unwrap();
        dispatch(addToast({ message: t("signUp.success"), type: "success" }));
        navigation.navigate("VerifyEmail");
      } else {
        throw new Error("User creation failed");
      }
    } catch (err) {
      const { message, code } = handleAndLogError(err as AppError, t);
      if (code === "auth/email-already-in-use") {
        showTempError("email", t("signUp.error.emailInUse"));
      } else {
        dispatch(addToast({ message, type: "error" }));
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
      {(errors.email || tempErrors.email) && (
        <FormErrorText>
          {t(errors.email?.message || tempErrors.email || "")}
        </FormErrorText>
      )}

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
      {errors.password && (
        <FormErrorText>{t(errors.password.message || "")}</FormErrorText>
      )}

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
      {errors.confirmPassword && (
        <FormErrorText>{t(errors.confirmPassword.message || "")}</FormErrorText>
      )}

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
