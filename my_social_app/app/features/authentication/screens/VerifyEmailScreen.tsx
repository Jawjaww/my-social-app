import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  useRoute,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectIsEmailVerified } from "../authSelectors";
import { setIsEmailVerified, setUser } from "../authSlice";
import {
  useSendVerificationEmailMutation,
  useVerifyEmailMutation,
} from "../../../services/api";
import {
  CenteredContainer,
  Container,
  Button,
  ButtonText,
  Card,
  CardText,
  StyledActivityIndicator,
} from "../../../components/StyledComponents";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import {
  AuthStackParamList,
  RootStackParamList,
} from "../../../types/sharedTypes";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type VerifyEmailScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  NativeStackNavigationProp<AuthStackParamList>
>;

const VerifyEmailScreen: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<AuthStackParamList, "VerifyEmail">>();
  const navigation = useNavigation<VerifyEmailScreenNavigationProp>();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isEmailVerified = useSelector(selectIsEmailVerified);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  const [sendVerificationEmail, { isLoading: isResending }] =
    useSendVerificationEmailMutation();
  const [verifyEmail] = useVerifyEmailMutation();

  console.log("VerifyEmailScreen mounted, route params:", route.params);

  useEffect(() => {
    const oobCode = route.params?.oobCode;
    if (oobCode && !isEmailVerified) {
      handleVerification(oobCode);
    } else {
      setLoading(false);
    }
  }, [route.params?.oobCode, isEmailVerified]);

  const handleVerification = useCallback(
    async (oobCode: string) => {
      if (!oobCode || isEmailVerified) {
        setLoading(false);
        return;
      }

      try {
        const result = await verifyEmail(oobCode).unwrap();
        if (result.success) {
          dispatch(setIsEmailVerified(true));
          dispatch(setUser(result.user));
          setMessage(t("verifyEmail.success"));
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "ChooseUsername" }],
            });
          }, 2000);
        }
      } catch (error: any) {
        if (error.code === "auth/invalid-action-code") {
          setMessage(t("verifyEmail.linkExpired"));
        } else {
          setMessage(t("verifyEmail.error"));
        }
      }
      setLoading(false);
    },
    [verifyEmail, t, navigation, dispatch, isEmailVerified]
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    try {
      await sendVerificationEmail().unwrap();
      setMessage(t("verifyEmail.resendSuccess"));
      setCountdown(60);
    } catch (error) {
      console.error("Error resending verification email:", error);
      setMessage(t("verifyEmail.resendError"));
    }
  };

  const handleCancel = () => {
    navigation.navigate("Auth", { screen: "SignIn" });
  };

  if (loading) {
    return (
      <Container>
        <StyledActivityIndicator size="large" color="#0000ff" />
      </Container>
    );
  }

  const buttonStyle = {
    backgroundColor:
      countdown > 0 ? theme.colors.disabled : theme.colors.primary,
  };

  return (
    <CenteredContainer>
      <Container>
        <Card>
          <Ionicons name="mail" size={24} color={theme.colors.primary} />
          <CardText>{t("verifyEmail.title")}</CardText>
        </Card>
        <CardText>{message}</CardText>
        {!isEmailVerified && user && (
          <Button
            onPress={handleResendEmail}
            disabled={countdown > 0 || isResending}
            style={buttonStyle}
          >
            <ButtonText
              style={{
                color:
                  countdown > 0
                    ? theme.colors.buttonText
                    : theme.colors.buttonText,
              }}
            >
              {countdown > 0
                ? `${t("verifyEmail.resendButton")} (${countdown}s)`
                : t("verifyEmail.resendButton")}
            </ButtonText>
          </Button>
        )}
        <Card onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          <CardText>{t("common.cancel")}</CardText>
        </Card>
      </Container>
    </CenteredContainer>
  );
};

export default VerifyEmailScreen;
