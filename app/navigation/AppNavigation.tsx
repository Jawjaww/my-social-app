import React, { useEffect, useState, Suspense, lazy } from "react";
import AppInitializer from "../components/AppInitializer";
import { ActivityIndicator, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useDeepLinking } from "../hooks/useDeepLinking";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { setUser, setLoading } from "../features/authentication/authSlice";
import { RootState } from "../store/store";
import {
  selectIsAuthenticated,
  selectIsEmailVerified,
} from "../features/authentication/authSelectors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  ProfileStackParamList,
  ContactsStackParamList,
  MessagesStackParamList,
  AppUser,
} from "../types/sharedTypes";
// Screens
import HomeScreen from "../features/home/screens/HomeScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import SignInScreen from "../features/authentication/screens/SignInScreen";
// Lazy load screens
const BootScreen = lazy(() => import("../features/boot/screens/BootScreen"));
const SendVerificationLinkScreen = lazy(
  () => import("../features/profile/screens/VerifyBeforeUpdateEmailScreen")
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
const VerifyNewEmailScreen = lazy(
  () => import("../features/profile/screens/VerifyNewEmailScreen")
);
const DiscoverScreen = lazy(
  () => import("../features/discover/screens/DiscoverScreen")
);
const EditEmailScreen = lazy(
  () => import("../features/profile/screens/EditEmailScreen")
);
const EditPasswordScreen = lazy(
  () => import("../features/profile/screens/EditPasswordScreen")
);
const EditUsernameScreen = lazy(
  () => import("../features/profile/screens/EditUsernameScreen")
);
const EditProfilePictureScreen = lazy(
  () => import("../features/profile/screens/EditProfilePictureScreen")
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
  </AuthStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
    <ProfileStack.Screen name="EditEmail" component={EditEmailScreen} />
    <ProfileStack.Screen name="EditPassword" component={EditPasswordScreen} />
    <ProfileStack.Screen name="Editusername" component={EditUsernameScreen} />
    <ProfileStack.Screen
      name="EditProfilePicture"
      component={EditProfilePictureScreen}
    />
    <ProfileStack.Screen
      name="NotificationSettings"
      component={NotificationSettingsScreen}
    />
    <ProfileStack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
    <ProfileStack.Screen
      name="VerifyNewEmail"
      component={VerifyNewEmailScreen}
    />
    <ProfileStack.Screen
      name="SendVerificationLink"
      component={SendVerificationLinkScreen}
    />
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
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = "home";
        if (route.name === "Home") {
          iconName = "home";
        } else if (route.name === "Discover") {
          iconName = "search";
        } else if (route.name === "Profile") {
          iconName = "person";
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
    <MainTab.Screen name="Profile" component={ProfileNavigator} />
    <MainTab.Screen name="Contacts" component={ContactsNavigator} />
    <MainTab.Screen name="Messages" component={MessagesNavigator} />
  </MainTab.Navigator>
);

const AppNavigation: React.FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isEmailVerified = useSelector(selectIsEmailVerified);
  const [isInitializing, setIsInitializing] = useState(true);
  const { handleVerifyEmail, handleVerifyNewEmail, handleResetPassword } =
    useDeepLinking();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          dispatch(setUser(JSON.parse(user)));
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        dispatch(setLoading(false));
        setIsInitializing(false);
      }
    };

    initializeApp();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          username: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || null,
          emailVerified: firebaseUser.emailVerified,
          isAuthenticated: true,
          isAwaitingEmailVerification: false,
        };
        dispatch(setUser(appUser));
        AsyncStorage.setItem("user", JSON.stringify(appUser));
      } else {
        dispatch(setUser(null));
        AsyncStorage.removeItem("user");
      }
      dispatch(setLoading(false));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  // handleUrl use useDeepLinking hook to handle different deep link types
  const handleUrl = async ({ url }: { url: string }) => {
    console.log("Deep link detected:", url);
    const parsedUrl = new URL(url);
    const mode = parsedUrl.searchParams.get("mode");
    const oobCode: string | null = parsedUrl.searchParams.get("oobCode");

    console.log("Parsed URL parameters:", { mode, oobCode });

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
              screen: "VerifyNewEmail",
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
    console.log("Deep link listener added");

    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("Initial URL:", url);
        handleUrl({ url });
      } else {
        console.log("No initial URL found");
      }
    });

    return () => {
      console.log("Removing deep link listener");
      subscription.remove();
    };
  }, []);

  if (isInitializing || loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <AppInitializer
      onInitializationComplete={() => (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          ) : !isEmailVerified ? (
            <RootStack.Screen
              name="VerifyEmail"
              component={VerifyEmailScreen}
            />
          ) : (
            <RootStack.Screen name="Main" component={MainTabNavigator} />
          )}
        </RootStack.Navigator>
      )}
    />
  );
};

export default AppNavigation;
