import React, { useEffect, useState, lazy, Suspense } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectProfile } from "../features/profile/profileSelectors";
import { useNavigation } from "@react-navigation/native";
import { useDeepLinking } from "../hooks/useDeepLinking";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { setUser, setLoading } from "../features/authentication/authSlice";
import { RootState } from "../store/store";
import {
  selectIsAuthenticated,
  selectIsEmailVerified,
} from "../features/authentication/authSelectors";
import {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  ProfileStackParamList,
  ContactsStackParamList,
  MessagesStackParamList,
} from "../types/sharedTypes";
import AvatarPhoto from "../components/AvatarPhoto";

// Screens
import HomeScreen from "../features/home/screens/HomeScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import SignInScreen from "../features/authentication/screens/SignInScreen";

// Lazy load screens
const ChooseUsernameScreen = lazy(
  () => import("../features/profile/screens/ChooseUsernameScreen")
);
const SignUpScreen = lazy(
  () => import("../features/authentication/screens/SignUpScreen")
);
const ForgotPasswordScreen = lazy(
  () => import("../features/authentication/screens/ForgotPasswordScreen")
);
const ResetPasswordScreen = lazy(
  () => import("../features/authentication/screens/ResetPasswordScreen")
);
const VerifyEmailScreen = lazy(
  () => import("../features/authentication/screens/VerifyEmailScreen")
);
const DiscoverScreen = lazy(
  () => import("../features/discover/screens/DiscoverScreen")
);
const EditPasswordScreen = lazy(
  () => import("../features/profile/screens/EditPasswordScreen")
);
const EditUsernameScreen = lazy(
  () => import("../features/profile/screens/EditUsernameScreen")
);
const AvatarManagerScreen = lazy(
  () => import("../features/profile/screens/AvatarManagerScreen")
);
const NotificationSettingsScreen = lazy(
  () => import("../features/profile/screens/NotificationSettingsScreen")
);
const DeleteAccountScreen = lazy(
  () => import("../features/profile/screens/DeleteAccountScreen")
);
const ContactListScreen = lazy(
  () => import("../features/contacts/screens/ContactListScreen")
);
const AddContactScreen = lazy(
  () => import("../features/contacts/screens/AddContactScreen")
);
const MessageListScreen = lazy(
  () => import("../features/messages/screens/MessageListScreen")
);
const ChatScreen = lazy(
  () => import("../features/messages/screens/ChatScreen")
);
const NewChatScreen = lazy(
  () => import("../features/messages/screens/NewChatScreen")
);
const ConfirmEmailChangeScreen = lazy(
  () => import("../features/profile/screens/ConfirmEmailChangeScreen")
);
const ChangeEmailScreen = lazy(
  () => import("../features/profile/screens/ChangeEmailScreen")
);

// Create navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const ContactsStack = createNativeStackNavigator<ContactsStackParamList>();
const MessagesStack = createNativeStackNavigator<MessagesStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="SignIn" component={SignInScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
  </AuthStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
    <ProfileStack.Screen name="EditPassword" component={EditPasswordScreen} />
    <ProfileStack.Screen name="Editusername" component={EditUsernameScreen} />
    <ProfileStack.Screen name="AvatarManager" component={AvatarManagerScreen} />
    <ProfileStack.Screen
      name="NotificationSettings"
      component={NotificationSettingsScreen}
    />
    <ProfileStack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
    <ProfileStack.Screen
      name="ConfirmEmailChange"
      component={ConfirmEmailChangeScreen}
    />
    <ProfileStack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
  </ProfileStack.Navigator>
);

const ContactsNavigator = () => (
  <ContactsStack.Navigator screenOptions={{ headerShown: false }}>
    <ContactsStack.Screen name="ContactList" component={ContactListScreen} />
    <ContactsStack.Screen name="AddContact" component={AddContactScreen} />
  </ContactsStack.Navigator>
);

const MessagesNavigator = () => (
  <MessagesStack.Navigator screenOptions={{ headerShown: false }}>
    <MessagesStack.Screen name="MessageList" component={MessageListScreen} />
    <MessagesStack.Screen name="Chat" component={ChatScreen} />
    <MessagesStack.Screen name="NewChat" component={NewChatScreen} />
  </MessagesStack.Navigator>
);

const MainTabNavigator = () => (
  <MainTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size, focused }) => {
        let iconName: keyof typeof Ionicons.glyphMap = "home";
        if (route.name === "Home") {
          iconName = "home";
        } else if (route.name === "Discover") {
          iconName = "search";
        } else if (route.name === "Profile") {
          return <AvatarPhoto size={size} />;
        } else if (route.name === "Contacts") {
          iconName = "people";
        } else if (route.name === "Messages") {
          iconName = "chatbubbles";
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <MainTab.Screen name="Home" component={HomeScreen} />
    <MainTab.Screen name="Discover" component={DiscoverScreen} />
    <MainTab.Screen name="Contacts" component={ContactsNavigator} />
    <MainTab.Screen name="Messages" component={MessagesNavigator} />
    <MainTab.Screen name="Profile" component={ProfileNavigator} />
  </MainTab.Navigator>
);

const AppNavigation: React.FC = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const username = profile?.username;
  const loading = useSelector((state: RootState) => state.auth.loading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isEmailVerified = useSelector(selectIsEmailVerified);
  const [isInitializing, setIsInitializing] = useState(true);
  const { handleVerifyEmail, handleResetPassword } = useDeepLinking();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // const navigationRef =
  //   useRef<NavigationContainerRef<RootStackParamList>>(null);

  useFirebaseAuth();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Add any additional initialization logic here
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        dispatch(setLoading(false));
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !isInitializing) {
      SplashScreen.hideAsync();
    }
  }, [loading, isInitializing]);

  // handleUrl use useDeepLinking hook to handle different deep link types
  const handleUrl = async ({ url }: { url: string }) => {
    console.log("Deep link detected:", url);
    const parsedUrl = new URL(url);
    const mode = parsedUrl.searchParams.get("mode");
    const oobCode: string | null = parsedUrl.searchParams.get("oobCode");

    if (oobCode) {
      console.log("oobCode found:", oobCode);
      switch (mode) {
        case "verifyEmail":
          console.log("Handling verifyEmail mode");
          await handleVerifyEmail(oobCode);
          break;
        case "verifyAndChangeEmail":
          console.log("Handling verifyAndChangeEmail mode");
          navigation.navigate("Main", {
            screen: "Profile",
            params: {
              screen: "ConfirmEmailChange",
              params: { oobCode },
            },
          });
          break;
        case "resetPassword":
          console.log("Handling resetPassword mode");
          navigation.navigate("Auth", {
            screen: "ResetPassword",
            params: { oobCode },
          });
          break;
        default:
          console.log("Unknown mode:", mode);
      }
    } else {
      console.log("No oobCode found in the URL");
    }
  };

  // Configure deep link listener and call handleUrl function
  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleUrl);

    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("Initial URL:", url);
        handleUrl({ url });
      } else {
        console.log("No initial linkingURL found");
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Render splash screen while initializing
  if (isInitializing || loading) {
    return null; // SplashScreen still visible
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated || !isEmailVerified ? (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      ) : !username ? (
        <RootStack.Screen
          name="ChooseUsername"
          component={ChooseUsernameScreen}
        />
      ) : (
        <RootStack.Screen name="Main" component={MainTabNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default AppNavigation;
