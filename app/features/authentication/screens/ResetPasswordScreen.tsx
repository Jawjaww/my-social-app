import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation, NavigationProp, RouteProp } from "@react-navigation/native";
import { AuthStackParamList, RootStackParamList } from "../../../types/sharedTypes";
import { useResetPasswordMutation, useSendPasswordResetEmailMutation } from "../../../services/api";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FormContainer,
  FormInput,
  FormButton,
  FormButtonText,
  FormErrorText,
  FormMessage,
} from "../../../styles/formStyles";
import { useDeepLinking } from "../../../hooks/useDeepLinking";
import { useDispatch } from "react-redux";
import { addToast } from "../../toast/toastSlice";

type ResetPasswordScreenRouteProp = RouteProp<AuthStackParamList, "ResetPassword">;

type Props = {
  route: ResetPasswordScreenRouteProp;
};

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6, "resetPassword.error.short")
    .required("resetPassword.error.required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "resetPassword.error.mismatch"),
});

const ResetPasswordScreen: React.FC<Props> = ({ route }) => {
  const { email, oobCode } = route.params || {};
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [sendPasswordResetEmail] = useSendPasswordResetEmailMutation();
  const { handleResetPassword } = useDeepLinking();
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!oobCode) {
      navigation.navigate("Auth", { screen: "ForgotPassword" });
    }

    const timer = setInterval(() => {
      setResendCountdown((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [oobCode, navigation]);

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    if (!oobCode) {
      setError("newPassword", {
        type: "manual",
        message: "resetPassword.error.missingCode",
      });
      return;
    }
    try {
      const success = await handleResetPassword(oobCode, data.newPassword);
      if (success) {
        dispatch(addToast({ message: t("resetPassword.success"), type: "success" }));
        navigation.navigate("Auth", { screen: "SignIn" });
      } else {
        throw new Error("Password reset failed");
      }
    } catch (err) {
      setError("newPassword", {
        type: "manual",
        message: "resetPassword.error.generic",
      });
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      dispatch(addToast({ message: t("resetPassword.emailMissing"), type: "error" }));
      return;
    }
    try {
      await sendPasswordResetEmail(email).unwrap();
      dispatch(addToast({ message: t("resetPassword.emailResent"), type: "success" }));
      setResendCountdown(60);
      setIsResendDisabled(true);
    } catch (error) {
      dispatch(addToast({ message: t("resetPassword.emailResentError"), type: "error" }));
    }
  };

  return (
    <FormContainer>
      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder={t("resetPassword.newPassword")}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.newPassword && (
        <FormErrorText>{t(errors.newPassword.message || "")}</FormErrorText>
      )}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder={t("resetPassword.confirmPassword")}
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
        <FormButtonText>{t("resetPassword.button")}</FormButtonText>
      </FormButton>
      <FormButton
        onPress={handleResendEmail}
        disabled={isResendDisabled}
        style={{ opacity: isResendDisabled ? 0.5 : 1 }}
      >
        <FormButtonText>
          {isResendDisabled
            ? `${t("resetPassword.resendEmail")} (${resendCountdown}s)`
            : t("resetPassword.resendEmail")}
        </FormButtonText>
      </FormButton>
    </FormContainer>
  );
};

export default ResetPasswordScreen;