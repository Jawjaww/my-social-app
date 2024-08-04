import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./mainstack/MainTabNavigator";
import { MainTabParamList } from "../navigationTypes";

const Stack = createNativeStackNavigator<MainTabParamList>();

const MainStack: React.FC = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen
          name="Message"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
  );
};

export default MainStack;