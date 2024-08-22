import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApplyEmailVerificationCodeMutation } from "../../../services/api";
import { useDispatch } from "react-redux";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { addToast } from "../../../features/toast/toastSlice";
import { ProfileStackParamList } from "../../../types/sharedTypes";
import { View, Text, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/authentication/authSelectors";
import { AppUser } from "../../../types/sharedTypes";
import { setUser } from "../../../features/authentication/authSlice";


type ConfirmEmailChangeScreenRouteProp = RouteProp<
  ProfileStackParamList,
  "ConfirmEmailChange"
>;

type Props = {
  route: ConfirmEmailChangeScreenRouteProp;
};

const ConfirmEmailChangeScreen: React.FC<Props> = ({ route }) => {
    const { oobCode } = route.params;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
    const [applyEmailVerificationCode, { isLoading }] = useApplyEmailVerificationCodeMutation();
    const user = useSelector(selectUser);
  
    console.log("ConfirmEmailChangeScreen monté, oobCode:", oobCode);
  
    useEffect(() => {
      console.log("useEffect déclenché, oobCode:", oobCode);
      if (oobCode) {
        handleConfirmEmailChange();
      }
    }, [oobCode]);
  
    const handleConfirmEmailChange = async () => {
        try {
          console.log("Début de handleConfirmEmailChange");
          const result = await applyEmailVerificationCode(oobCode).unwrap();
          console.log("Résultat de applyEmailVerificationCode:", result);
          if (result.success) {
            console.log("Email changé avec succès, mise à jour de l'utilisateur");
            const auth = getAuth();
            const firebaseUser = auth.currentUser;
            if (firebaseUser) {
              console.log("Rechargement de l'utilisateur Firebase");
              await firebaseUser.reload();
              const updatedAppUser: AppUser = {
                ...user,
                uid: user?.uid || firebaseUser.uid, 
                email: firebaseUser.email || "",
                emailVerified: firebaseUser.emailVerified,
                username: user?.username || null,
                photoURL: user?.photoURL || null,
                isAuthenticated: true,
                isAwaitingEmailVerification: false,
              };
              dispatch(setUser(updatedAppUser));
              console.log("AppUser mis à jour dans le store Redux");
            }
          }
        } catch (error) {
          console.error("Erreur lors de la confirmation du changement d'email:", error);
        }
      };

  return (
    <View>
      <ActivityIndicator animating={isLoading} />
      <Text>{t("Verifying your email...")}</Text>
    </View>
  );
};

export default ConfirmEmailChangeScreen;
