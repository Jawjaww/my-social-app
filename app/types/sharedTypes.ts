import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Shared types
export interface SharedActivity {
  id: string;
  userId: string;
  type:
    | "header"
    | "section"
    | "empty"
    | "profile_update"
    | "new_contact"
    | "new_post"
    | "new_comment";
  timestamp: number;
  description: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface Contact {
  id: string;
  name: string;
  avatar?: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

// Auth types
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAuthenticated: boolean;
}

// Navigation types
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

// Screen props types
export type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>,
  BottomTabScreenProps<MainTabParamList>
>;

export interface MessageListScreenProps {
  navigation: NativeStackNavigationProp<MessagesStackParamList, 'MessageList'>;
}

export interface ChatScreenProps {
  navigation: NativeStackNavigationProp<MessagesStackParamList, 'Chat'>;
  route: RouteProp<MessagesStackParamList, 'Chat'>;
}

export interface ContactListScreenProps {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<ContactsStackParamList, 'ContactList'>,
    CompositeNavigationProp<
      NativeStackNavigationProp<RootStackParamList>,
      NativeStackNavigationProp<MainTabParamList>
    >
  >;
}

export interface AddContactScreenProps {
  navigation: NativeStackNavigationProp<ContactsStackParamList, 'AddContact'>;
}

// Utility types
export type NavigatorScreenParams<T> = {
  [K in keyof T]: undefined extends T[K] ? { screen: K; params?: T[K] }
    : { screen: K; params: T[K] };
}[keyof T];

export type CompositeScreenProps<T, S> = T & S;

export type NativeStackScreenProps<
  T extends Record<string, object | undefined>,
  K extends keyof T
> = {
  navigation: NativeStackNavigationProp<T, K>;
  route: RouteProp<T, K>;
};

export type BottomTabScreenProps<
  T extends Record<string, object | undefined>,
  K extends keyof T = keyof T
> = {
  navigation: BottomTabNavigationProp<T, K>;
  route: RouteProp<T, K>;
};