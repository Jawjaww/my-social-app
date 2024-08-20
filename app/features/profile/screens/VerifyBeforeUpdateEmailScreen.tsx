import React from "react";
import { useTranslation } from "react-i18next";
import { useVerifyBeforeUpdateEmailMutation } from "../../../services/api";
import { useDispatch } from "react-redux";
import { addToast } from "../../toast/toastSlice";
import { setPendingNewEmail } from "../profileSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormContainer, FormButton, FormInput, FormErrorText, FormButtonText } from "../../../styles/formStyles";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../types/sharedTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

type VerifyBeforeUpdateEmailScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'VerifyBeforeUpdateEmail'
>;

const schema = yup.object().shape({
  newEmail: yup.string().email("Invalid email").required("Email is required"),
  confirmEmail: yup
    .string()
    .oneOf([yup.ref("newEmail"), ""], "Emails must match")
    .required("Please confirm your email"),
  password: yup.string().required("Password is required"),
});

const VerifyBeforeUpdateEmail: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<VerifyBeforeUpdateEmailScreenNavigationProp>();
  const [verifyBeforeUpdateEmail, { isLoading }] = useVerifyBeforeUpdateEmailMutation();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSendLink = async (data: { newEmail: string; confirmEmail: string; password: string }) => {
    console.log("Début de handleSendLink avec newEmail:", data.newEmail);
    if (data.newEmail === currentUser?.email) {
      console.log("Tentative de mise à jour avec l'e-mail actuel");
      dispatch(addToast({ message: t("editEmail.error.sameEmail"), type: "error" }));
      return;
    }
  
    try {
      const result = await verifyBeforeUpdateEmail({ newEmail: data.newEmail, password: data.password }).unwrap();
      console.log("Résultat de verifyBeforeUpdateEmail:", result);
      if (result.success) {
        dispatch(setPendingNewEmail(data.newEmail));
        dispatch(addToast({ message: t("editEmail.verificationSent"), type: "success" }));
        navigation.navigate('ProfileHome');
      }
    } catch (error) {
      console.error("Erreur dans handleSendLink:", error);
      dispatch(addToast({ message: t("editEmail.error.generic"), type: "error" }));
    }
  };

  return (
    <FormContainer>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder={t("editEmail.newEmailPlaceholder")}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="newEmail"
      />
      {errors.newEmail && <FormErrorText>{t(errors.newEmail.message || "")}</FormErrorText>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder={t("editEmail.confirmEmail")}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="confirmEmail"
      />
      {errors.confirmEmail && <FormErrorText>{t(errors.confirmEmail.message || "")}</FormErrorText>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder={t("editEmail.passwordPlaceholder")}
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
      />
      {errors.password && <FormErrorText>{t(errors.password.message || "")}</FormErrorText>}

      <FormButton onPress={handleSubmit(handleSendLink)} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <FormButtonText>{t("editEmail.sendVerification")}</FormButtonText>
        )}
      </FormButton>
    </FormContainer>
  );
};

export default VerifyBeforeUpdateEmail;