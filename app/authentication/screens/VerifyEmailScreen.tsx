import React, { useEffect, useState } from "react";
import { Button, ActivityIndicator, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import useVerifyEmail from "../../hooks/useVerifyEmail";
import styled from "@emotion/native";
import {
  AuthStackParamList,
  RootStackParamList,
} from "../../navigation/navigationTypes";
import useAuthActions from "../../hooks/useAuthActions";
import { getAuth } from "firebase/auth";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

const Heading = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const MessageText = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
`;

const VerifyEmailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { verifyEmail } = useVerifyEmail();
  const route = useRoute<RouteProp<AuthStackParamList, "VerifyEmail">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const { sendVerificationEmail } = useAuthActions();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const handleVerification = async () => {
      console.log("VerifyEmailScreen: Starting verification process");
      const oobCode = route.params?.oobCode;
      if (!oobCode) {
        console.log("VerifyEmailScreen: No oobCode found in route params");
        setMessage(t("verifyEmail.error.noCode"));
        setLoading(false);
        return;
      }
  
      console.log("VerifyEmailScreen: Calling verifyEmail with oobCode");
      const result = await verifyEmail(oobCode);
      console.log("VerifyEmailScreen: Verification result", result);
      setMessage(result.message);
      setLoading(false);
  
      if (result.success) {
        console.log("VerifyEmailScreen: Verification successful, navigating to Main in 2 seconds");
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
        }, 2000);
      }
    };
  
    handleVerification();
  }, [route.params?.oobCode, verifyEmail, t, navigation]);

  const handleResendVerificationEmail = async () => {
    if (user) {
      try {
        setResendLoading(true);
        await sendVerificationEmail(user);
        setMessage(t("verifyEmail.resendSuccess"));
      } catch (error) {
        setMessage(t("verifyEmail.resendError"));
      } finally {
        setResendLoading(false);
      }
    } else {
      setMessage(t("verifyEmail.error.noUser"));
    }
  };

  return (
    <Container>
      <Heading>{t("verifyEmail.title")}</Heading>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <MessageText>{message}</MessageText>
          {(message === t("verifyEmail.error.noCode") ||
            message === t("verifyEmail.linkExpired")) && (
            <Button
              title={t("verifyEmail.resendButton")}
              onPress={handleResendVerificationEmail}
              disabled={resendLoading}
            />
          )}
          <Button
  title={t("common.cancel")}
  onPress={() => {
    console.log("Attempting to navigate back or to Welcome screen");
    navigation.navigate('Auth', { screen: 'Welcome' });
  }}
/>
        </>
      )}
    </Container>
  );
};

export default VerifyEmailScreen;
