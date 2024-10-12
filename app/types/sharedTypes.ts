import { RouteProp, CompositeNavigationProp } from "@react-navigation/native";
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { IMessage as GiftedIMessage } from "react-native-gifted-chat";
import { IMessage as GiftedChatMessage } from 'react-native-gifted-chat';

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
// export interface User {
//   uid: string;
//   id: string;
//   email: string | null;
//   username: string | null;
//   avatarUri: string | null;
//   emailVerified: boolean;
// }

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
  avatarUri?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  isSignUpComplete: boolean;
  // Add other profile specific fields here
};
export interface Contacts {
  [contactUid: string]: Contact;
}

export interface Contact {
  contactUid: string;
  contactUsername: string;
  contactAvatarUrl: string | null;
  contactAvatarUri?: string | null;
  lastInteraction: number;
  bio?: string;
  notificationToken?: string | null; 
}

// Messages types
// GiftedChat types

export interface IMessage extends Omit<GiftedChatMessage, 'createdAt'> {
  createdAt: number | Date; // Supprimez 'string' comme type possible
  channelId: string;
  sent?: boolean;
  received?: boolean;
}

export interface SQLiteMessage {
  _id: string;
  text: string;
  createdAt: string;
  user: string; // JSON stringified
  channelId: string;
  sent: number; // 0 or 1
  received: number; // 0 or 1
}

// Navigation types
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  ChooseUsername: undefined;
  Permissions: undefined;
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
  Chat: { contactUid: string };
  ContactDetails: { contactUid: string };
};

export type MessagesStackParamList = {
  Conversations: undefined;
  Chat: { contactUid: string };
  NewChat: undefined;
  GroupChat: { groupId: string };
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

export interface AvatarPhotoProps {
  size?: number;
  isActive?: boolean;
  avatarSource?: string | null;
  username?: string | null;
}

export interface ConversationsScreenProps {
  navigation: NativeStackNavigationProp<MessagesStackParamList, "Conversations">;
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

export type MessageSubscription = {
  remove: () => void;
};
