import React, { useEffect, useCallback, useMemo, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Linking, ActivityIndicator, View, Text } from "react-native";
import WelcomeScreen from "../authentication/screens/WelcomeScreen";
import {
  SignUpScreen,
  SignInScreen,
  GoogleSignInScreen,
  VerifyEmailScreen,
  userState,
  loadingState,
  errorState,
} from "../authentication";
import { useReloadUser, useAuth, useSendVerificationEmail } from "../hooks";
import MainStack from "./MainStack";
import { getAuth, applyActionCode } from "firebase/auth";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigation } from "@react-navigation/native";

// Create a native stack navigator
const Stack = createNativeStackNavigator();

const RootStack: React.FC = () => {
  useAuth(); // Initialize authentication state
  const navigation = useNavigation();

  const user = useRecoilValue(userState);
  const setLoading = useSetRecoilState(loadingState);
  const setError = useSetRecoilState(errorState);
  const [reloadUser, isReloading, reloadError] = useReloadUser();
  const auth = getAuth();
  const [success, setSuccess] = useState<string | null>(null);

  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url) {
        const parsedUrl = new URL(url);
        const mode = parsedUrl.searchParams.get("mode");
        const oobCode = parsedUrl.searchParams.get("oobCode");

        if (mode === "verifyEmail" && oobCode) {
          try {
            setLoading(true);
            await applyActionCode(auth, oobCode);
            await reloadUser();
            setSuccess('Your email address has been successfully verified.');
            navigation.navigate('PasswordConfirmation' as never);
          } catch (error) {
            setError("Error verifying email. Please try again.");
          } finally {
            setLoading(false);
          }
        }
      }
    },
    [reloadUser, setLoading, setError, navigation]
  );

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      console.log("Initial URL:", url);
      handleDeepLink(url);
    });
    const listener = Linking.addEventListener("url", (event: { url: string }) => {
      console.log("Received URL:", event.url);
      handleDeepLink(event.url);
    });
    return () => listener.remove();
  }, [handleDeepLink]);

  const navigationState = useMemo(() => {
    if (!user) return "auth";
    if (!user.emailVerified) return "verify";
    return "main";
  }, [user]);

  if (useRecoilValue(loadingState) || isReloading) {
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
    <NavigationContainer>
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
    </NavigationContainer>
  );
};

export default RootStack;
