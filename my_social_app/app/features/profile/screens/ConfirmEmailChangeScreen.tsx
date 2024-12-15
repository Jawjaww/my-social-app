import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApplyEmailVerificationCodeMutation } from "../../../services/api";
import { useDispatch } from "react-redux";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { addToast } from "../../../features/toast/toastSlice";
import { ProfileStackParamList } from "../../../types/sharedTypes";
import { ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { setUser } from "../../../features/authentication/authSlice";
import {
  CenteredContainer,
  Container,
} from "../../../components/StyledComponents";
import styled from "@emotion/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { CompositeNavigationProp } from "@react-navigation/native";
// import { RootStackParamList } from "../../../types/sharedTypes";

const StyledText = styled.Text`
  font-size: 16px;
  margin-top: 10px;
`;

// type ConfirmEmailChangeScreenNavigationProp = CompositeNavigationProp<
//   NativeStackNavigationProp<ProfileStackParamList>,
//   NativeStackNavigationProp<RootStackParamList>
// >;

type Props = {
  route: RouteProp<ProfileStackParamList, 'ConfirmEmailChange'>;
};

const ConfirmEmailChangeScreen: React.FC<Props> = ({ route }) => {
  const { oobCode } = route.params;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [applyEmailVerificationCode, { isLoading }] =
    useApplyEmailVerificationCodeMutation();

  useEffect(() => {
    if (oobCode) {
      handleConfirmEmailChange();
    }
  }, [oobCode]);

  const handleConfirmEmailChange = async () => {
    try {
      const result = await applyEmailVerificationCode(oobCode).unwrap();
      console.log("Résultat de applyEmailVerificationCode:", result);
      if (result.success && result.user) {
        dispatch(setUser(result.user));
        // await AsyncStorage.setItem("user", JSON.stringify(result.user));
        
        dispatch(
          addToast({
            type: "success",
            message: t("confirmEmailChange.success"),
          })
        );
        navigation.navigate("ProfileHome");
      } else {
        throw new Error("Email change confirmation failed");
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation du changement d'email:", error);
      if (error instanceof Error && error.message.includes("auth/user-token-expired")) {
        dispatch(
          addToast({
            type: "info",
            message: t("confirmEmailChange.tokenExpired"),
          })
        );
        // Disconnect the user
        dispatch(setUser(null));
        // await AsyncStorage.removeItem("user");
      } else {
        dispatch(
          addToast({
            type: "error",
            message: t("confirmEmailChange.error"),
          })
        );
      }
    }
  };

  return (
    <CenteredContainer>
      <Container>
        <ActivityIndicator animating={isLoading} size="large" />
        <StyledText>{t("confirmEmailChange.verifying")}</StyledText>
      </Container>
    </CenteredContainer>
  );
};

export default ConfirmEmailChangeScreen;
