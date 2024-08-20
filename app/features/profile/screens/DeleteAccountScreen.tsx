import React from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
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

const schema = yup.object().shape({
  password: yup.string().required(() => "deleteAccount.emptyPassword"),
});

const DeleteAccountScreen: React.FC = () => {
  const { t } = useTranslation();
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        {t("deleteAccount.title")}
      </Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={t("deleteAccount.passwordPlaceholder")}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: "gray",
              padding: 10,
              marginBottom: 20,
            }}
          />
        )}
        name="password"
        defaultValue=""
      />
      {errors.password && (
        <Text style={{ color: "red" }}>
          {t(errors.password.message as string)}
        </Text>
      )}
      <Button
        title={t("deleteAccount.button")}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        color="red"
      />
    </View>
  );
};

export default DeleteAccountScreen;
