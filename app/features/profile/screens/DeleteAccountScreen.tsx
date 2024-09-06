import React from "react";
import { Alert, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { useDeleteAccountMutation } from "../../../services/api";
import Toast from "../../../components/Toast";
import { addToast } from '../../toast/toastSlice';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../authentication/authSlice";
import { selectUser } from "../../authentication/authSelectors";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { handleAndLogError, AppError } from "../../../services/errorService";
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
import { useNavigation } from "@react-navigation/native";

const schema = yup.object().shape({
  password: yup.string().required(() => "deleteAccount.emptyPassword"),
});

const DeleteAccountScreen: React.FC = () => {
  const { t } = useTranslation();
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigation = useNavigation();

  const onSubmit = async (data: { password: string }) => {
    Alert.alert(
      t("deleteAccount.confirmTitle"),
      t("deleteAccount.confirmMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.confirm"),
          style: "destructive",
          onPress: async () => {
            try {
              const auth = getAuth();
              if (!user || !user.email) {
                throw new Error("No user is currently signed in");
              }

              const credential = EmailAuthProvider.credential(
                user.email,
                data.password
              );
              await reauthenticateWithCredential(auth.currentUser!, credential);

              const result = await deleteAccount({
                password: data.password,
              }).unwrap();
              if (result.success) {
                dispatch(setUser(null));
                dispatch(addToast({ message: t("deleteAccount.success"), type: "success" }));
              } else {
                throw new Error("Account deletion failed");
              }
            } catch (error) {
              const errorMessage = handleAndLogError(error as AppError, t);
              Toast({ message: errorMessage, type: "error" });
            }
          },
        },
      ]
    );
  };

  return (
    <CenteredContainer>
      <Container>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("deleteAccount.passwordPlaceholder")}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
          name="password"
          defaultValue=""
        />
        {errors.password && (
          <ErrorText>
            {t(errors.password.message as string)}
          </ErrorText>
        )}
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.buttonText} />
          ) : (
            <ButtonText>{t("deleteAccount.button")}</ButtonText>
          )}
        </Button>
        <Card onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          <CardText>{t('common.buttons.back')}</CardText>
        </Card>
      </Container>
    </CenteredContainer>
  );
};

export default DeleteAccountScreen;