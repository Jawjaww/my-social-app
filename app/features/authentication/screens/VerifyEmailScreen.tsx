import React, { useEffect, useState } from "react";
import { ActivityIndicator, Linking } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "@emotion/native";
import { FormContainer, FormMessage, FormButton, FormButtonText } from "../../../styles/formStyles";
import { useDeepLinking } from "../../../hooks/useDeepLinking";
import { useSendVerificationEmailMutation } from "../../../services/api";

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/sharedTypes';

type VerifyEmailScreenProps = NativeStackScreenProps<RootStackParamList, 'VerifyEmail'>;

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({ navigation, route }) => {

  const { t } = useTranslation();
  const { handleVerifyEmail } = useDeepLinking();
  const [sendVerificationEmail] = useSendVerificationEmailMutation();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    sendVerificationEmail();
  }, []);

  useEffect(() => {
    const getOobCodeFromUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const parsedUrl = new URL(url);
        const oobCode = parsedUrl.searchParams.get("oobCode");
        if (oobCode) {
          verifyEmail(oobCode);
        } else {
          setLoading(false);
          setMessage(t("verifyEmail.error.noCode"));
        }
      }
    };
  
    getOobCodeFromUrl();
  }, []);

  const verifyEmail = async (oobCode: string) => {
    setLoading(true);
    try {
      const success = await handleVerifyEmail(oobCode);
      if (success) {
        setMessage(t("verifyEmail.success"));
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
        }, 2000);
      } else {
        throw new Error("La vérification de l'e-mail a échoué");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'e-mail:", error);
      setMessage(t("verifyEmail.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    try {
      setResendLoading(true);
      await sendVerificationEmail().unwrap();
      setMessage(t("verifyEmail.resendSuccess"));
    } catch (error) {
      setMessage(t("verifyEmail.resendError"));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <FormContainer>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FormMessage>{message}</FormMessage>
          {(message === t("verifyEmail.error.noCode") ||
            message === t("verifyEmail.linkExpired")) && (
            <FormButton
              onPress={handleResendVerificationEmail}
              disabled={resendLoading}
            >
              <FormButtonText>{t("verifyEmail.resendButton")}</FormButtonText>
            </FormButton>
          )}
          <FormButton
            onPress={() => navigation.navigate('Auth', { screen: 'SignIn' })}
          >
            <FormButtonText>{t("common.cancel")}</FormButtonText>
          </FormButton>
        </>
      )}
    </FormContainer>
  );
};

export default VerifyEmailScreen;
