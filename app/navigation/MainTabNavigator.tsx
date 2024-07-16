import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../profile/screens/ProfileScreen";
import MessagesScreen from "../messages/screens/MessagesScreen";
import { MainTabParamList } from "./navigationTypes";

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  const navigation = useNavigation();
  const route = useRoute();

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "";
    if (
      routeName === "EditDisplayName" ||
      routeName === "EditEmail" ||
      routeName === "EditPassword"
    ) {
      navigation.setOptions({ tabBarVisible: false });
    } else {
      navigation.setOptions({ tabBarVisible: true });
    }
  }, [navigation, route]);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Message" component={MessagesScreen} />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
