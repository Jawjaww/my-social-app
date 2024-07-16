import React, { useEffect, useCallback, useMemo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Linking, ActivityIndicator, View, Text } from "react-native";
import WelcomeScreen from "../screens/WelcomeScreen";
import SignUpScreen from "../authentication/screens/SignUpScreen";
import SignInScreen from "../authentication/screens/SignInScreen";
import GoogleSignIn from "../authentication/screens/GoogleSignInScreen";
import VerifyEmailScreen from "../authentication/screens/VerifyEmailScreen";
import MainStack from "./MainStack";
import { getAuth, applyActionCode } from "firebase/auth";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  userState,
  loadingState,
  errorState,
} from "../authentication/recoil/authAtoms";
import { useReloadUser } from "../authentication/hooks/useReloadUser";
import { useAuthState } from "../authentication/hooks/useAuthState";

const Stack = createNativeStackNavigator();

const RootStack: React.FC = () => {
  useAuthState(); // Initialize authentication state

  const user = useRecoilValue(userState);
  const setLoading = useSetRecoilState(loadingState);
  const setError = useSetRecoilState(errorState);
  const [reloadUser, isReloading, reloadError] = useReloadUser();
  const auth = getAuth();

  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url) {
        console.log("Handling deep link:", url);
        const parsedUrl = new URL(url);
        const mode = parsedUrl.searchParams.get("mode");
        const oobCode = parsedUrl.searchParams.get("oobCode");
        console.log("Parsed URL:", parsedUrl);
        console.log("Mode:", mode);
        console.log("OOB Code:", oobCode);
        if (mode === "verifyEmail" && oobCode) {
          try {
            setLoading(true); // Set loading to true while applying action code
            await applyActionCode(auth, oobCode);
            await reloadUser();
            if (reloadError) {
              throw reloadError;
            }
          } catch (error) {
            setError(
              "Erreur lors de la vérification de l'email. Veuillez réessayer."
            );
          } finally {
            setLoading(false);
          }
        }
      }
    },
    [reloadUser, setLoading, setError]
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
      <Stack.Navigator>
        {navigationState === "auth" && (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="GoogleSignIn" component={GoogleSignIn} />
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
