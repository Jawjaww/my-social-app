import React from "react";
import { useTranslation } from "react-i18next";
import { useSendPasswordResetEmailMutation } from "../../../services/api";
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
import { addToast } from "../../../features/toast/toastSlice";
import { useDispatch } from "react-redux";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { AuthStackParamList } from "../../../types/sharedTypes";
import { Ionicons } from '@expo/vector-icons';
import { theme } from "../../../styles/theme";

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
      <CenteredContainer>
        <Container>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={t("forgotPassword.emailPlaceholder")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <ErrorText>{t(errors.email.message || "")}</ErrorText>
          )}
          <Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
            <ButtonText>{t("forgotPassword.button")}</ButtonText>
          </Button>
          <Card onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
            <CardText>{t("common.buttons.back")}</CardText>
          </Card>
        </Container>
      </CenteredContainer>
  );
};

export default ForgotPasswordScreen;