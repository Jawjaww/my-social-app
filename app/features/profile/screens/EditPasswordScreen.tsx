import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useUpdatePasswordMutation } from "../../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../types/sharedTypes";
import { addToast } from "../../../features/toast/toastSlice";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FormHeader,
  FormContainer,
  FormInput,
  FormButton,
  FormButtonText,
  FormErrorText,
} from "../../../styles/formStyles";

const schema = yup.object().shape({
  currentPassword: yup.string().required("editPassword.error.required"),
  newPassword: yup
    .string()
    .min(6, "editPassword.error.short")
    .required("editPassword.error.required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "editPassword.error.mismatch"),
});

const EditPasswordScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
  try {
    const result = await updatePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    }).unwrap();
    if (result.success) {
      dispatch(
        addToast({ message: t("editPassword.success"), type: "success" })
      );
      navigation.goBack();
    } else {
      dispatch(
        addToast({ message: t("editPassword.error.generic"), type: "error" })
      );
    }
  } catch (err: any) {
    console.error("Error during password update:", err);
    dispatch(
      addToast({ message: t("editPassword.error.generic"), type: "error" })
    );
  }
};

  return (
    <FormContainer>
      <FormHeader>{t("editPassword.title")}</FormHeader>
      <Controller
        control={control}
        name="currentPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder={t("editPassword.currentPassword")}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.currentPassword && (
        <FormErrorText>{t(errors.currentPassword.message || "")}</FormErrorText>
      )}

      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder={t("editPassword.newPassword")}
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
            placeholder={t("editPassword.confirmPassword")}
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
        <FormButtonText>{t("editPassword.updateButton")}</FormButtonText>
      </FormButton>
    </FormContainer>
  );
};

export default EditPasswordScreen;
