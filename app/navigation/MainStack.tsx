import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./MainTabNavigator";
import { EditDisplayNameScreen, EditEmailScreen, EditPasswordScreen, ProfileScreen } from "../profile";
import { MainTabParamList } from "./navigationTypes";
const Stack = createNativeStackNavigator<MainTabParamList>();

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditDisplayName" component={EditDisplayNameScreen} />
      <Stack.Screen name="EditEmail" component={EditEmailScreen} />
      <Stack.Screen name="EditPassword" component={EditPasswordScreen} />
    </Stack.Navigator>
  );
}

export default MainStack;
