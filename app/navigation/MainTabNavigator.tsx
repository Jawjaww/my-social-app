import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
  useRoute,
  NavigationProp,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import { ProfileScreen } from "../profile";
import MessagesScreen from "../messages/screens/MessagesScreen";
import { MainTabParamList, RootStackParamList } from "./navigationTypes";
import { useRecoilValue } from "recoil";
import { userState } from "../authentication/recoil/authAtoms";
import VerifyEmailScreen from "../authentication/screens/VerifyEmailScreen";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const user = useRecoilValue(userState);
  const { t } = useTranslation();

  // if the user is not verified, toast a message for the user to verify their email
  useEffect(() => {
    if (user && !user.emailVerified) {
      Toast.show({
        type: 'info',
        text1: t("verifyEmail.instructions"),
      });
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