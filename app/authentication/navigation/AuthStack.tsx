import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignInScreen, SignUpScreen, GoogleSignInScreen } from "../screens";


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
