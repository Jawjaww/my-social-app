import React, { useState, useEffect } from "react";
import { Button } from "react-native";
import { useSelector } from "react-redux";
import { selectUser } from "../../authentication/authSelectors";
import styled from "@emotion/native";
import { useTranslation } from "react-i18next";
import { useSendVerificationEmailMutation } from "../../../services/api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../types/sharedTypes";

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

const Instructions = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
`;

const VerifyNewEmailScreen: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const [countdown, setCountdown] = useState(60);
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [sendVerificationEmail, { isLoading, error }] = useSendVerificationEmailMutation();

  const handleResendEmail = async () => {
    try {
      await sendVerificationEmail().unwrap();
      setCountdown(60);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <Container>
      <Heading>{t("verifyEmail.title")}</Heading>
      <Instructions>
        {t("verifyEmail.instructions", { email: user?.email })}
      </Instructions>
      {error && <ErrorText>{(error as any).data?.message || t("verifyEmail.error.generic")}</ErrorText>}
      <Button
        title={
          countdown > 0
            ? `${t("verifyEmail.resendButton")} (${countdown}s)`
            : t("verifyEmail.resendButton")
        }
        onPress={handleResendEmail}
        disabled={countdown > 0 || isLoading}
      />
      <Button
        title={t("common.cancel")}
        onPress={() => navigation.navigate("ProfileHome")}
      />
    </Container>
  );
};

export default VerifyNewEmailScreen;