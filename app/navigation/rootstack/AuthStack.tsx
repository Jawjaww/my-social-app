import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../../features/authentication/screens/SignInScreen";
import SignUpScreen from "../../features/authentication/screens/SignUpScreen";
import GoogleSignInScreen from "../../features/authentication/screens/GoogleSignInScreen";
import ForgotPasswordScreen from "../../features/authentication/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../../features/authentication/screens/ResetPasswordScreen";
import { AuthStackParamList } from "../navigationTypes";

const Stack = createNativeStackNavigator<AuthStackParamList>();

type AuthNavigatorProps = {
  route: {
    params?: {
      screen?: keyof AuthStackParamList;
    };
  };
};

function AuthNavigator({ route }: AuthNavigatorProps) {
  const initialRoute = route.params?.screen || "Welcome";

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="GoogleSignIn" component={GoogleSignInScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;