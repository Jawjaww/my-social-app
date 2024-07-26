import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import { ProfileScreen } from "../profile";
import MessagesScreen from "../messages/screens/MessagesScreen";
import { MainTabParamList } from "./navigationTypes";
import { useRecoilValue } from "recoil";
import { userState } from "../authentication/recoil/authAtoms";
import VerifyEmailScreen from "../authentication/screens/VerifyEmailScreen";

// create the bottom tab navigator 
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  const navigation = useNavigation();
  const route = useRoute();
  const user = useRecoilValue(userState);

  // if the user is not verified, navigate to the verify email screen
  useEffect(() => {
    if (user && !user.emailVerified) {
      navigation.navigate("VerifyEmail" as never);
    }
  }, [user, navigation]);

  // if the user is in the edit profile screen, hide the tab bar
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
    <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Profile") {
            iconName = "person";
          } else if (route.name === "Message") {
            iconName = "chatbubbles";
          } else {
            iconName = "home"; // Default icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {user && user.emailVerified ? (
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Message" component={MessagesScreen} />
        </>
      ) : (
        <Tab.Screen
          name="VerifyEmail"
          component={VerifyEmailScreen}
          options={{ tabBarButton: () => null }}
        />
      )}
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
