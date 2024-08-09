import React, { useEffect, useState, Suspense, lazy } from 'react';
import AppInitializer from '../components/AppInitializer';
import { View, ActivityIndicator, Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer, LinkingOptions, NavigatorScreenParams, getStateFromPath } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { setUser, setLoading } from '../features/authentication/authSlice';
import { RootState } from '../store';
import { selectIsAuthenticated, selectIsEmailVerified } from '../features/authentication/authSelectors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  ProfileStackParamList,
  ContactsStackParamList,
  MessagesStackParamList,
  AppUser
} from '../types/sharedTypes';
// Screens
import HomeScreen from '../features/home/screens/HomeScreen';
// Lazy load screens
// const HomeScreen = lazy(() => import('../features/home/screens/HomeScreen'));
const BootScreen = lazy(() => import('../features/boot/screens/BootScreen'));
const SignInScreen = lazy(() => import('../features/authentication/screens/SignInScreen'));
const SignUpScreen = lazy(() => import('../features/authentication/screens/SignUpScreen'));
const ForgotPasswordScreen = lazy(() => import('../features/authentication/screens/ForgotPasswordScreen'));
const ResetPasswordScreen = lazy(() => import('../features/authentication/screens/ResetPasswordScreen'));
const VerifyEmailScreen = lazy(() => import('../features/authentication/screens/VerifyEmailScreen'));
const DiscoverScreen = lazy(() => import('../features/discover/screens/DiscoverScreen'));
const ProfileScreen = lazy(() => import('../features/profile/screens/ProfileScreen'));
const EditEmailScreen = lazy(() => import('../features/profile/screens/EditEmailScreen'));
const EditPasswordScreen = lazy(() => import('../features/profile/screens/EditPasswordScreen'));
const EditDisplayNameScreen = lazy(() => import('../features/profile/screens/EditDisplayNameScreen'));
const EditProfilePictureScreen = lazy(() => import('../features/profile/screens/EditProfilePictureScreen'));
const NotificationSettingsScreen = lazy(() => import('../features/profile/screens/NotificationSettingsScreen'));
const DeleteAccountScreen = lazy(() => import('../features/profile/screens/DeleteAccountScreen'));
const ContactListScreen = lazy(() => import('../features/contacts/screens/ContactListScreen'));
const AddContactScreen = lazy(() => import('../features/contacts/screens/AddContactScreen'));
const MessageListScreen = lazy(() => import('../features/messages/screens/MessageListScreen'));
const ChatScreen = lazy(() => import('../features/messages/screens/ChatScreen'));
const NewChatScreen = lazy(() => import('../features/messages/screens/NewChatScreen'));

// Create navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const ContactsStack = createNativeStackNavigator<ContactsStackParamList>();
const MessagesStack = createNativeStackNavigator<MessagesStackParamList>();

// Define sub-navigators
const AuthNavigator = React.memo(() => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="SignIn" component={SignInScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </AuthStack.Navigator>
));

const ProfileNavigator = React.memo(() => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
    <ProfileStack.Screen name="EditEmail" component={EditEmailScreen} />
    <ProfileStack.Screen name="EditPassword" component={EditPasswordScreen} />
    <ProfileStack.Screen name="EditDisplayName" component={EditDisplayNameScreen} />
    <ProfileStack.Screen name="EditProfilePicture" component={EditProfilePictureScreen} />
    <ProfileStack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
    <ProfileStack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
  </ProfileStack.Navigator>
));

const ContactsNavigator = React.memo(() => (
  <ContactsStack.Navigator>
    <ContactsStack.Screen name="ContactList" component={ContactListScreen} />
    <ContactsStack.Screen name="AddContact" component={AddContactScreen} />
  </ContactsStack.Navigator>
));

const MessagesNavigator = React.memo(() => (
  <MessagesStack.Navigator>
    <MessagesStack.Screen name="MessageList" component={MessageListScreen} />
    <MessagesStack.Screen name="Chat" component={ChatScreen} />
    <MessagesStack.Screen name="NewChat" component={NewChatScreen} />
  </MessagesStack.Navigator>
));

const MainTabNavigator = React.memo(() => (
  <MainTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home';

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Discover') {
          iconName = 'search';
        } else if (route.name === 'Messages') {
          iconName = 'chatbubbles';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <MainTab.Screen name="Home" component={HomeScreen} />
    <MainTab.Screen name="Discover" component={DiscoverScreen} />
    <MainTab.Screen name="Messages" component={MessagesNavigator} />
    <MainTab.Screen name="Profile" component={ProfileNavigator} />
  </MainTab.Navigator>
));

// Main AppNavigation component
const AppNavigation: React.FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isEmailVerified = useSelector(selectIsEmailVerified);
  const [isInitializing, setIsInitializing] = useState(true);


  useEffect(() => {
    const initializeApp = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          dispatch(setUser(JSON.parse(user)));
        }
      } catch (error) {
        console.error('Error initializing app:', error);
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
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          isAuthenticated: true,
        };
        dispatch(setUser(appUser));
        AsyncStorage.setItem('user', JSON.stringify(appUser));
      } else {
        dispatch(setUser(null));
        AsyncStorage.removeItem('user');
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['https://mysocialapp.expo.dev', 'mysocialapp://'],
    config: {
      screens: {
        Auth: {
          screens: {
            ResetPassword: 'resetPassword/:oobCode',
          },
        },
        VerifyEmail: 'email-verified',
        Main: {
          screens: {
            Home: 'home',
            Profile: 'profile',
            Messages: 'messages',
          },
        },
      },
    },
    getStateFromPath: (path, config) => {
      const state = getStateFromPath(path, config);
      if (path.includes('email-verified')) {
        const params = new URLSearchParams(path.split('?')[1]);
        const oobCode = params.get('oobCode');
        if (oobCode) {
          return {
            ...state,
            routes: [
              {
                name: 'VerifyEmail',
                params: { oobCode },
              },
            ],
          };
        }
      }
      return state;
    },
  };

  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      console.log('Deep link detected:', url);
    };

    const subscription = Linking.addEventListener('url', handleUrl);
    Linking.getInitialURL().then(url => {
      if (url) console.log('Initial URL:', url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (isInitializing || loading) {
    return (
      <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
        <BootScreen />
      </Suspense>
    );
  }

  return (
    <AppInitializer
      onInitializationComplete={() => (
        <NavigationContainer linking={linking}>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
              <RootStack.Screen name="Auth" component={AuthNavigator} />
            ) : !isEmailVerified ? (
              <RootStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
            ) : (
              <RootStack.Screen name="Main" component={MainTabNavigator} />
            )}
          </RootStack.Navigator>
        </NavigationContainer>
      )}
    />
  );
};

export default AppNavigation;
