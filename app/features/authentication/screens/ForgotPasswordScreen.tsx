import React from "react";
import { useTranslation } from "react-i18next";
import { useSendPasswordResetEmailMutation } from "../../../services/api";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FormContainer,
  FormInput,
  FormButton,
  FormButtonText,
  FormErrorText,
} from "../../../styles/formStyles";
import { addToast } from "../../../features/toast/toastSlice";
import { useDispatch } from "react-redux";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { AuthStackParamList } from "../../../types/sharedTypes";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("forgotPassword.error.invalidEmail")
    .required("forgotPassword.error.required"),
});

type ForgotPasswordScreenNavigationProp = NavigationProp<
  AuthStackParamList,
  "ForgotPassword"
>;

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [sendPasswordResetEmail, { isLoading }] =
    useSendPasswordResetEmailMutation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      await sendPasswordResetEmail(data.email).unwrap();
      dispatch(
        addToast({ message: t("forgotPassword.success"), type: "success" })
      );
      navigation.navigate("ResetPassword", { email: data.email, oobCode: "" });
    } catch (err) {
      if (err && typeof err === "object" && "error" in err) {
        setError("email", { type: "manual", message: t(err.error as string) });
      } else {
        setError("email", {
          type: "manual",
          message: t("forgotPassword.error.generic"),
        });
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
            placeholder={t("forgotPassword.emailPlaceholder")}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && (
        <FormErrorText>{t(errors.email.message || "")}</FormErrorText>
      )}
      <FormButton onPress={handleSubmit(onSubmit)} disabled={isLoading}>
        <FormButtonText>{t("forgotPassword.button")}</FormButtonText>
      </FormButton>
      <FormButton onPress={() => navigation.goBack()} variant="secondary">
        <FormButtonText>{t("common.buttons.back")}</FormButtonText>
      </FormButton>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
