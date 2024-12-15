import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import {
  useSignUpMutation,
  useSendVerificationEmailMutation,
} from "../../../services/api";
import {
  AuthStackParamList,
  RootStackParamList,
} from "../../../types/sharedTypes";
import {
  NavigationProp,
  CompositeNavigationProp,
} from "@react-navigation/native";
import {
  CenteredContainer,
  Container,
  Input,
  Button,
  ButtonText,
  ErrorText,
  Card,
  CardText,
} from "../../../components/StyledComponents";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import { useDispatch } from "react-redux";
import { setProfile } from "../../../features/profile/profileSlice";
import { setUser } from "../../../features/authentication/authSlice";
import { addToast } from "../../../features/toast/toastSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SignUpScreenNavigationProp = CompositeNavigationProp<
  NavigationProp<AuthStackParamList>,
  NavigationProp<RootStackParamList>
>;

function SignUpScreen() {
  const [signUp, { isLoading }] = useSignUpMutation();
  const [sendVerificationEmail] = useSendVerificationEmailMutation();
  const { t } = useTranslation();
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const dispatch = useDispatch();
  
  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t("auth.error.invalidEmail"))
      .required(t("auth.error.emailRequired")),
    password: yup
      .string()
      .min(6, t("auth.error.passwordTooShort"))
      .required(t("auth.error.passwordRequired")),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], t("auth.error.passwordMismatch"))
      .required(t("auth.error.confirmPasswordRequired")),
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const result = await signUp(data).unwrap();
      if (result.appUser && result.profileUser) {
        dispatch(setUser(result.appUser));
        dispatch(setProfile(result.profileUser));
        // await AsyncStorage.setItem("profile", JSON.stringify(result.profileUser));        
        await sendVerificationEmail().unwrap();
        navigation.navigate("VerifyEmail", { email: data.email });
      } else {
        throw new Error("User creation failed");
      }
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("email", { 
          type: "manual", 
          message: t("auth.error.emailAlreadyInUse") 
        });
      } else {
        console.error(err);
        dispatch(addToast({
          type: "error",
          message: t("auth.error.signUpFailed"),
        }));
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
              placeholder={t("signUp.emailPlaceholder")}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("signUp.passwordPlaceholder")}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("signUp.confirmPasswordPlaceholder")}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.confirmPassword && (
          <ErrorText>{errors.confirmPassword.message}</ErrorText>
        )}

        <Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
          <ButtonText>{t("signUp.button")}</ButtonText>
        </Button>
        <Card onPress={() => navigation.navigate("Auth", { screen: "SignIn" })}>
          <Ionicons name="log-in" size={24} color={theme.colors.primary} />
          <CardText>{t("signUp.alreadyHaveAccount")}</CardText>
        </Card>
        <Card
          onPress={() =>
            navigation.navigate("Auth", { screen: "GoogleSignIn" })
          }
        >
          <Ionicons name="logo-google" size={24} color={theme.colors.primary} />
          <CardText>{t("signUp.googleSignUp")}</CardText>
        </Card>
      </Container>
    </CenteredContainer>
  );
}

export default SignUpScreen;
