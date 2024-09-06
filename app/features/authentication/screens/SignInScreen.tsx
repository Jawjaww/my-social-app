import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import { useNavigation } from "@react-navigation/native";
import { useSignInMutation } from "../../../services/api";
import { handleAndLogError, AppError } from "../../../services/errorService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addToast } from "../../../features/toast/toastSlice";
import { useForm, Controller } from "react-hook-form";
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
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectProfile } from "../../../features/profile/profileSelectors";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList, RootStackParamList } from "../../../types/sharedTypes";

type SignInScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

type SignInScreenRouteProp = RouteProp<AuthStackParamList, 'SignIn'>;

type Props = {
  route: SignInScreenRouteProp;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email("common.errors.invalidEmail")
    .required("common.errors.required"),
  password: yup.string().required("common.errors.required"),
});

const SignInScreen: React.FC<Props> = ({ route }) => {
  const emailChanged = route.params?.emailChanged;
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const [signIn, { isLoading }] = useSignInMutation();
  const profile = useSelector(selectProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (emailChanged) {
      dispatch(addToast({
        type: "info",
        message: t("signIn.emailChanged"),
      }));
    }
  }, [emailChanged]);

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
      const result = await signIn(data).unwrap();
      if (result.isAuthenticated) {
        dispatch(
          addToast({ message: t("auth.signIn.success"), type: "success" })
        );
        if (!profile?.username) {
          navigation.navigate("ChooseUsername");
        } else {
          navigation.navigate("Main", { screen: "Home" });
        }
      } else {
        throw new Error("Authentication failed");
      }
    } catch (err: any) {
      const { message, code } = handleAndLogError(err as AppError, t);
      switch (code) {
        case "auth/invalid-email":
        case "auth/user-disabled":
        case "auth/user-not-found":
          setError("email", {
            type: "manual",
            message: t(`errors.${code}`),
          });
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("password", {
            type: "manual",
            message: t(`errors.${code}`),
          });
          break;
        case "auth/network-request-failed":
          dispatch(addToast({ message: t(`errors.${code}`), type: "error" }));
          break;
        default:
          dispatch(addToast({ message, type: "error" }));
      }
    }
  };
  
  console.log("Rendering SignInScreen components");
  console.log("SignInScreen state:", { isLoading });

  return (
      <CenteredContainer>
        <Container>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={t("common.placeholders.email")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
            name="email"
          />
          {errors.email && (
            <ErrorText>{t(errors.email.message as string)}</ErrorText>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={t("common.placeholders.password")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
            name="password"
          />
          {errors.password && (
            <ErrorText>{t(errors.password.message as string)}</ErrorText>
          )}

          <Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={theme.colors.buttonText} />
            ) : (
              <ButtonText>{t("auth.signIn.button")}</ButtonText>
            )}
          </Button>

          <Card onPress={() => navigation.navigate("ForgotPassword")}>
            <Ionicons
              name="key-outline"
              size={24}
              color={theme.colors.primary}
            />
            <CardText>{t("auth.signIn.forgotPassword")}</CardText>
          </Card>

          <Card onPress={() => navigation.navigate("SignUp")}>
            <Ionicons
              name="person-add-outline"
              size={24}
              color={theme.colors.primary}
            />
            <CardText>{t("auth.signIn.noAccount")}</CardText>
          </Card>
        </Container>
      </CenteredContainer>
  );
};

export default SignInScreen;
