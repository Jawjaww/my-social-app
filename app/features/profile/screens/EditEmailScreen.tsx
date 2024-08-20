import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../authentication/authSelectors";
import { addToast } from "../../toast/toastSlice";
import { setIsAwaitingEmailVerification } from "../../authentication/authSlice";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updateEmail, sendEmailVerification } from "firebase/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../types/sharedTypes";
import { FormContainer, FormButton, FormButtonText, FormErrorText, FormInput } from "../../../styles/formStyles"; 
import { RootState } from "../../../store/store";

// Validation schema using Yup
const schema = yup.object().shape({
  newEmail: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const EditEmailScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAwaitingEmailVerification = useSelector(
    (state: RootState) => state.auth.isAwaitingEmailVerification
  );
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Function to change the email address
  const changeEmail = async (newEmail: string, password: string) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Re-authentication
      const credential = EmailAuthProvider.credential(currentUser.email!, password);
      await reauthenticateWithCredential(currentUser, credential);

      // Update the email address
      await updateEmail(currentUser, newEmail);
      
      // Send a verification email
      await sendEmailVerification(currentUser);
    }
  };

  // Form submission handler
  const onSubmit = async (data: { newEmail: string; password: string }) => {
    if (data.newEmail === user?.email) {
      dispatch(
        addToast({ message: t("editEmail.error.sameEmail"), type: "error" })
      );
      return;
    }

    try {
      dispatch(setIsAwaitingEmailVerification(true));
      await changeEmail(data.newEmail, data.password);
      dispatch(
        addToast({
          message: t("editEmail.verificationSent"),
          type: "success",
        })
      );
      navigation.navigate("FinalizeEmailUpdate", { newEmail: data.newEmail });
    } catch (err) {
      console.error("Error during email update:", err);
      dispatch(
        addToast({ message: t("editEmail.error.generic"), type: "error" })
      );
    } finally {
      dispatch(setIsAwaitingEmailVerification(false));
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

      <FormButton
        onPress={handleSubmit(onSubmit)}
        disabled={isAwaitingEmailVerification}
      >
        <FormButtonText>{t("editEmail.updateButton")}</FormButtonText>
      </FormButton>
    </FormContainer>
  );
};

export default EditEmailScreen;