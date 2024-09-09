import { RouteProp, CompositeNavigationProp } from "@react-navigation/native";

import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';


// Shared Data Types
export interface Activity {
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
  username: string;
  avatar?: string;
}

export interface User {
  uid: string;
  id: string;
  email: string | null;
  username: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
}

// Auth types
export interface AppUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  isAuthenticated: boolean;
}

export interface ProfileUser {
  uid: string;
  username: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  // Add other profile specific fields here
};

// Navigation types
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  ChooseUsername: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined | { emailChanged: boolean };
  SignUp: undefined;
  GoogleSignIn: undefined;
  ForgotPassword: undefined;
  ResetPassword: { oobCode?: string; email?: string };
  VerifyEmail: { email: string; oobCode?: string };};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditEmail: undefined;
  EditPassword: undefined;
  Editusername: undefined;
  AvatarManager: undefined;
  VerifyNewEmail: { oobCode: string };
  VerifyBeforeUpdateEmail: undefined;
  NotificationSettings: undefined;
  DeleteAccount: undefined;
  FinalizeEmailUpdate: { newEmail: string; mode?: string };
  SendVerificationLink: undefined;
  ChangeEmail: undefined;
  ConfirmEmailChange: { oobCode: string };
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
export type ProfileScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  "ProfileHome"
>;

export interface MessageListScreenProps {
  navigation: NativeStackNavigationProp<MessagesStackParamList, "MessageList">;
}

export interface ChatScreenProps {
  navigation: NativeStackNavigationProp<MessagesStackParamList, "Chat">;
  route: RouteProp<MessagesStackParamList, "Chat">;
}

export interface ContactListScreenProps {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<ContactsStackParamList, "ContactList">,
    CompositeNavigationProp<
      NativeStackNavigationProp<RootStackParamList>,
      NativeStackNavigationProp<MainTabParamList>
    >
  >;
}

export interface AddContactScreenProps {
  navigation: NativeStackNavigationProp<ContactsStackParamList, "AddContact">;
}

export type CompositeScreenProps<T, S> = T & S;

// Discover types
export interface Category {
  id: string;
  name: string;
}