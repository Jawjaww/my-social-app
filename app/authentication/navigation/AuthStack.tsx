import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import GoogleSignInScreen from "../screens/GoogleSignInScreen";

const Stack = createNativeStackNavigator();

function AuthStack() {
  console.log("Rendering AuthStack");
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="GoogleSignIn" component={GoogleSignInScreen} />
    </Stack.Navigator>
  );
}

export default AuthStack;
