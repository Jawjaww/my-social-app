import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer, LinkingOptions, NavigatorScreenParams, getStateFromPath } from '@react-navigation/native';
import { Linking } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { setUser, setLoading } from '../features/authentication/authSlice';
import { AppUser } from '../features/authentication/authTypes';
import { RootState } from '../store';
import { selectIsAuthenticated, selectIsEmailVerified } from '../features/authentication/authSelectors';


// Import all screens
import BootScreen from '../features/boot/screens/BootScreen';
import SignInScreen from '../features/authentication/screens/SignInScreen';
import SignUpScreen from '../features/authentication/screens/SignUpScreen';
import ForgotPasswordScreen from '../features/authentication/screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../features/authentication/screens/ResetPasswordScreen';
import VerifyEmailScreen from '../features/authentication/screens/VerifyEmailScreen';
import HomeScreen from '../features/home/screens/HomeScreen';
import DiscoverScreen from '../features/discover/screens/DiscoverScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import EditEmailScreen from '../features/profile/screens/EditEmailScreen';
import EditPasswordScreen from '../features/profile/screens/EditPasswordScreen';
import EditDisplayNameScreen from '../features/profile/screens/EditDisplayNameScreen';
import EditProfilePictureScreen from '../features/profile/screens/EditProfilePictureScreen';
import NotificationSettingsScreen from '../features/profile/screens/NotificationSettingsScreen';
import DeleteAccountScreen from '../features/profile/screens/DeleteAccountScreen';
import ContactListScreen from '../features/contacts/screens/ContactListScreen';
import AddContactScreen from '../features/contacts/screens/AddContactScreen';
import MessageListScreen from '../features/messages/screens/MessageListScreen';
import ChatScreen from '../features/messages/screens/ChatScreen';
import NewChatScreen from '../features/messages/screens/NewChatScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Define all navigation types
export type RootStackParamList = {
    Boot: undefined;
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Main: NavigatorScreenParams<MainTabParamList>;
    VerifyEmail: { oobCode?: string };
  };
  
  export type AuthStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    GoogleSignIn: undefined;
    ForgotPassword: undefined;
    ResetPassword: { oobCode: string };
  };
  
  export type ProfileStackParamList = {
    ProfileHome: undefined;
    EditEmail: undefined;
    EditPassword: undefined;
    EditDisplayName: undefined;
    EditProfilePicture: undefined;
    VerifyNewEmail: undefined;
    NotificationSettings: undefined;
    Pseudo: undefined;
    DeleteAccount: undefined;
  };
  
  export type ContactsStackParamList = {
    ContactList: undefined;
    AddContact: undefined;
  };
  
  export type MessagesStackParamList = {
    MessageList: undefined;
    Chat: { contactId: string };
    NewChat: undefined;
  };
  
  export type MainTabParamList = {
    Home: undefined;
    Discover: undefined;
    Profile: NavigatorScreenParams<ProfileStackParamList>;
    Contacts: NavigatorScreenParams<ContactsStackParamList>;
    Messages: NavigatorScreenParams<MessagesStackParamList>;
  };

// Define types for ProfileScreenProps
type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>,
  BottomTabScreenProps<MainTabParamList>
>;

// Create navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const ContactsStack = createNativeStackNavigator<ContactsStackParamList>();
const MessagesStack = createNativeStackNavigator<MessagesStackParamList>();

// Define sub-navigators
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="SignIn" component={SignInScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </AuthStack.Navigator>
);

const ProfileNavigator = () => (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="ProfileHome" 
        component={ProfileScreen as React.FC<ProfileScreenProps>} 
      />
      <ProfileStack.Screen name="EditEmail" component={EditEmailScreen} />
      <ProfileStack.Screen name="EditPassword" component={EditPasswordScreen} />
      <ProfileStack.Screen name="EditDisplayName" component={EditDisplayNameScreen} />
      <ProfileStack.Screen name="EditProfilePicture" component={EditProfilePictureScreen} />
      <ProfileStack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <ProfileStack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
    </ProfileStack.Navigator>
  );

const ContactsNavigator = () => (
  <ContactsStack.Navigator>
    <ContactsStack.Screen name="ContactList" component={ContactListScreen} />
    <ContactsStack.Screen name="AddContact" component={AddContactScreen} />
  </ContactsStack.Navigator>
);

const MessagesNavigator = () => (
  <MessagesStack.Navigator>
    <MessagesStack.Screen name="MessageList" component={MessageListScreen} />
    <MessagesStack.Screen name="Chat" component={ChatScreen} />
    <MessagesStack.Screen name="NewChat" component={NewChatScreen} />
  </MessagesStack.Navigator>
);

const MainTabNavigator = () => (
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
  );

// Main AppNavigation component
const AppNavigation: React.FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isEmailVerified = useSelector(selectIsEmailVerified);

  useEffect(() => {
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
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });
  
    return () => unsubscribe();
  }, [dispatch]);

const RootStack = createNativeStackNavigator<RootStackParamList>();

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
    const handleUrl = ({url}: {url: string}) => {
      console.log("Deep link detected:", url);
    };
  
    const subscription = Linking.addEventListener('url', handleUrl);
    Linking.getInitialURL().then(url => {
      if (url) console.log("Initial URL:", url);
    });
  
    return () => {
      subscription.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {loading ? (
          <RootStack.Screen name="Boot" component={BootScreen} />
        ) : !isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : !isEmailVerified ? (
          <RootStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        ) : (
          <RootStack.Screen name="Main" component={MainTabNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;