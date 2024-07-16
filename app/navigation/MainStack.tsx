import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./MainTabNavigator";
import EditDisplayNameScreen from "../profile/screens/EditDisplayNameScreen";
import EditEmailScreen from "../profile/screens/EditEmailScreen";
import EditPasswordScreen from "../profile/screens/EditPasswordScreen";
import { MainTabParamList } from "./navigationTypes";
import ProfileScreen from "../profile/screens/ProfileScreen";
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
