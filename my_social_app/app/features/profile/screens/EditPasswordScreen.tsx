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
  CenteredContainer,
  Container,
  Input,
  Button,
  ButtonText,
  ErrorText,
  Card,
  CardText
} from "../../../components/StyledComponents";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@emotion/react";

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
  const theme = useTheme();
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
    <CenteredContainer>
      <Container>
        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("editPassword.currentPassword")}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.currentPassword && (
          <ErrorText>{t(errors.currentPassword.message || "")}</ErrorText>
        )}

        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("editPassword.newPassword")}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.newPassword && (
          <ErrorText>{t(errors.newPassword.message || "")}</ErrorText>
        )}

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("editPassword.confirmPassword")}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.confirmPassword && (
          <ErrorText>{t(errors.confirmPassword.message || "")}</ErrorText>
        )}
        <Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
          <ButtonText>{t("editPassword.updateButton")}</ButtonText>
        </Button>

        <Card onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          <CardText>{t('common.buttons.back')}</CardText>
        </Card>
      </Container>
    </CenteredContainer>
  );
};

export default EditPasswordScreen;