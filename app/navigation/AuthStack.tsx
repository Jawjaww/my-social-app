import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../authentication/screens/WelcomeScreen";
import SignInScreen from "../authentication/screens/SignInScreen";
import SignUpScreen from "../authentication/screens/SignUpScreen";
import GoogleSignInScreen from "../authentication/screens/GoogleSignInScreen";
import ForgotPasswordScreen from "../authentication/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../authentication/screens/ResetPasswordScreen";
import VerifyEmailScreen from "../authentication/screens/VerifyEmailScreen";
import { AuthStackParamList } from "./navigationTypes";

const Stack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="GoogleSignIn" component={GoogleSignInScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;