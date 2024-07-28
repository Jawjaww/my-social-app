import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, Text } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loadingState, errorState } from "../authentication/recoil/authAtoms";
import { useTranslation } from "react-i18next";
import useDeepLinking from "../hooks/useDeepLinking";
import { useAuthState } from "../hooks";
import { RootStackParamList } from "./navigationTypes";
import RootStackNavigator from "./RootStackNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack: React.FC = () => {
  const { user } = useAuthState();
  const setLoading = useSetRecoilState(loadingState);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useDeepLinking();

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
        <View style={{ padding: 10, backgroundColor: "lightgreen" }}>
          <Text>{success}</Text>
        </View>
      )}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" component={RootStackNavigator} />
      </Stack.Navigator>
    </>
  );
};

export default RootStack;