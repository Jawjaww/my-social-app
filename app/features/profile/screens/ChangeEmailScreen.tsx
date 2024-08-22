import React from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useReauthenticateAndUpdateEmailMutation } from "../../../services/api";
import { addToast } from "../../toast/toastSlice";
import {
  FormContainer,
  FormInput,
  FormButton,
  FormButtonText,
  FormErrorText,
} from "../../../styles/formStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../types/sharedTypes";

type ChangeEmailScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  "ChangeEmail"
>;

const schema = yup.object().shape({
  newEmail: yup
    .string()
    .email("invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const ChangeEmailScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ChangeEmailScreenNavigationProp>();
  const dispatch = useDispatch();
  const [reauthenticateAndUpdateEmail, { isLoading }] =
    useReauthenticateAndUpdateEmailMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { newEmail: string; password: string }) => {
    console.log("onSubmit called with data:", data);
    try {
      console.log("Calling reauthenticateAndUpdateEmail");
      const result = await reauthenticateAndUpdateEmail(data).unwrap();
      console.log("reauthenticateAndUpdateEmail result:", result);
      if (result.success && result.emailSent) {
        console.log("Email sent successfully");
        navigation.navigate("ProfileHome");
        dispatch(
          addToast({
            message: t("changeEmail.emailVerificationSent"),
            type: "success",
          })
        );
      } else {
        console.log("Failed to send verification email");
        throw new Error("Failed to send verification email");
      }
    } catch (err: any) {
      console.error("Error in onSubmit:", err);
      if (err.error === "This email is already in use") {
        dispatch(
          addToast({
            message: t("This email is already in use"),
            type: "error",
          })
        );
      } else {
        dispatch(
          addToast({ message: err.error || t("Error occurred"), type: "error" })
        );
      }
    }
  };

  return (
    <FormContainer>
      <Controller
        control={control}
        name="newEmail"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder={t("Enter your new email")}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.newEmail && (
        <FormErrorText>{t(errors.newEmail.message || "")}</FormErrorText>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder={t("Enter your password")}
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

      <FormButton onPress={handleSubmit(onSubmit)} disabled={isLoading}>
        <FormButtonText>{t("Send verification email")}</FormButtonText>
      </FormButton>
    </FormContainer>
  );
};

export default ChangeEmailScreen;
