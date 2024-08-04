import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import AuthStack from "./rootstack/AuthStack";
import VerifyEmailScreen from "../features/authentication/screens/VerifyEmailScreen";
import MainStack from "./rootstack/MainStack";
import { RootStackParamList, AuthStackParamList } from "./navigationTypes";
import { NavigatorScreenParams } from "@react-navigation/native";
import { RootState } from "../store";
import { selectIsAuthenticated, selectIsEmailVerified } from '../features/authentication/authSelectors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isEmailVerified = useSelector(selectIsEmailVerified);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated && (
        <Stack.Screen 
          name="Auth" 
          component={AuthStack} 
        />
      )}
      {isAuthenticated && !isEmailVerified && (
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      )}
      {isAuthenticated && isEmailVerified && (
        <Stack.Screen name="Main" component={MainStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigation;