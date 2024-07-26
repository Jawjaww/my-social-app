import React, { useMemo, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, Text } from "react-native";
import WelcomeScreen from "../authentication/screens/WelcomeScreen";
import {
  SignUpScreen,
  SignInScreen,
  ForgotPasswordScreen,
  GoogleSignInScreen,
  VerifyEmailScreen,
  ResetPasswordScreen,
} from "../authentication";
import { useAuthManagement } from "../hooks"; 
import MainStack from "./MainStack";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loadingState, errorState } from "../authentication/recoil/authAtoms";
import { useTranslation } from 'react-i18next'; 
import useDeepLinking from '../hooks/useDeepLinking';

const Stack = createNativeStackNavigator();

const RootStack: React.FC = () => {
  const { user, setError, reloadUser } = useAuthManagement(); 
  const setLoading = useSetRecoilState(loadingState);
  const [success, setSuccess] = useState<string | null>(null);
  const { t } = useTranslation(); 

  useDeepLinking(
    (message) => {
      setSuccess(message);
    },
    (error) => {
      setError(error);
    }
  );

  const navigationState = useMemo(() => {
    if (!user) return "auth";
    if (!user.emailVerified) return "verify";
    return "main";
  }, [user]);

  if (useRecoilValue(loadingState)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (useRecoilValue(errorState)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{useRecoilValue(errorState)}</Text>
      </View>
    );
  }

  return (
    <>
      {success && (
        <View style={{ padding: 10, backgroundColor: 'lightgreen' }}>
          <Text>{success}</Text>
        </View>
      )}
      <Stack.Navigator>
        {navigationState === "auth" && (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="GoogleSignIn" component={GoogleSignInScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        )}
        {navigationState === "verify" && (
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        )}
        {navigationState === "main" && (
          <Stack.Screen
            name="Main"
            component={MainStack}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </>
  );
};

export default RootStack;