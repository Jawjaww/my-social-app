import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectIsEmailVerified } from "../authSelectors";
import { setIsEmailVerified, setUser } from "../authSlice";
import {
  useSendVerificationEmailMutation,
  useVerifyEmailMutation,
} from "../../../services/api";
import { RootStackParamList, AuthStackParamList } from "../../../types/sharedTypes";
import styled from "@emotion/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

const Heading = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const MessageText = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
`;

const VerifyEmailScreen: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<AuthStackParamList, "VerifyEmail">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
              routes: [{ name: "Main" }],
            });
          }, 2000);
        } else {
          throw new Error("Verification failed");
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
        <ActivityIndicator size="large" color="#0000ff" />
      </Container>
    );
  }

  return (
    <Container>
      <Heading>{t("verifyEmail.title")}</Heading>
      <MessageText>{message}</MessageText>
      {!isEmailVerified && user && (
        <Button
          title={
            countdown > 0
              ? `${t("verifyEmail.resendButton")} (${countdown}s)`
              : t("verifyEmail.resendButton")
          }
          onPress={handleResendEmail}
          disabled={countdown > 0 || isResending}
        />
      )}
      <Button title={t("common.cancel")} onPress={handleCancel} />
    </Container>
  );
};

export default VerifyEmailScreen;