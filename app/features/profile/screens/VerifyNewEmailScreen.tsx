import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addToast } from "../../toast/toastSlice";

import { ProfileStackParamList, RootStackParamList,  } from "../../../types/sharedTypes";
import { useTranslation } from "react-i18next";
import { FormContainer } from "../../../styles/formStyles";
import { useDeepLinking } from "../../../hooks/useDeepLinking";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


type VerifyNewEmailScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'VerifyNewEmail'
>;

type VerifyNewEmailScreenRouteProp = RouteProp<ProfileStackParamList, 'VerifyNewEmail'>;

const VerifyNewEmailScreen: React.FC<{ route: VerifyNewEmailScreenRouteProp }> = ({ route }) => {
  const { oobCode } = route.params || {};
    const { t } = useTranslation();
  const dispatch = useDispatch();
  const { handleVerifyNewEmail } = useDeepLinking();
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const navigation = useNavigation<VerifyNewEmailScreenNavigationProp>();

  useEffect(() => {
    const verifyEmail = async () => {
      if (oobCode) {
        try {
          const success = await handleVerifyNewEmail(oobCode);
          if (success) {
            setVerificationStatus('success');
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'ProfileHome' }],
              });
            }, 2000);
          } else {
            throw new Error("La vérification a échoué");
          }
        } catch (error) {
          setVerificationStatus('error');
          console.error("Erreur de vérification d'e-mail:", error);
          dispatch(addToast({ message: t("editEmail.error.verification"), type: "error" }));
        }
      } else {
        setVerificationStatus('error');
        dispatch(addToast({ message: t("editEmail.error.missingInfo"), type: "error" }));
      }
    };
  
    verifyEmail();
  }, [oobCode, handleVerifyNewEmail, dispatch, t, navigation]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'idle':
        return <ActivityIndicator size="large" color="#0000ff" />;
      case 'success':
        return <Text>{t("editEmail.verificationSuccess")}</Text>;
      case 'error':
        return <Text>{t("editEmail.verificationError")}</Text>;
      default:
        return null;
    }
  };

  return (
    <FormContainer>
      {renderContent()}
    </FormContainer>
  );
};

export default VerifyNewEmailScreen;