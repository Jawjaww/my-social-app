import { RouteProp, CompositeNavigationProp } from "@react-navigation/native";
import styled from "@emotion/native";
import { Theme } from "@emotion/react";
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// export { NavigatorScreenParams, NativeStackNavigationProp, NativeStackScreenProps, BottomTabNavigationProp, BottomTabScreenProps };

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
  photoURL: string | null;
  avatar: string | null;
  emailVerified: boolean;
}

// Auth types
export interface AppUser {
  uid: string;
  email: string | null;
  username: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAuthenticated: boolean;
  isAwaitingEmailVerification?: boolean;
}

// Navigation types
export type RootStackParamList = {
  Boot: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  VerifyEmail: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  GoogleSignIn: undefined;
  ForgotPassword: undefined;
  ResetPassword: { oobCode?: string; email?: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditEmail: undefined;
  EditPassword: undefined;
  Editusername: undefined;
  EditProfilePicture: undefined;
  VerifyNewEmail: { oobCode: string };
  VerifyBeforeUpdateEmail: undefined;
  NotificationSettings: undefined;
  DeleteAccount: undefined;
  FinalizeEmailUpdate: { newEmail: string; mode?: string };
  SendVerificationLink: undefined;
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

// export type NativeStackScreenProps<
//   T extends Record<string, object | undefined>,
//   K extends keyof T
// > = {
//   navigation: NativeStackNavigationProp<T, K>;
//   route: RouteProp<T, K>;
// };

// export type BottomTabScreenProps<
//   T extends Record<string, object | undefined>,
//   K extends keyof T = keyof T
// > = {
//   navigation: BottomTabNavigationProp<T, K>;
//   route: RouteProp<T, K>;
// };

export const Container = styled.View<{ theme: Theme }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  padding: ${(props) => props.theme.spacing.md}px;
`;

export const Header = styled.Text<{ theme: Theme }>`
  font-size: ${(props) => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

export const Button = styled.TouchableOpacity<{
  theme: Theme;
  variant?: "primary" | "secondary";
}>`
  background-color: ${(props) =>
    props.variant === "secondary"
      ? props.theme.colors.secondary
      : props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.sm}px
    ${(props) => props.theme.spacing.md}px;
  border-radius: ${(props) => props.theme.borderRadius.medium}px;
  align-items: center;
  justify-content: center;
`;
