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

export interface IMessage extends GiftedChatMessage {
  channelId: string;
  _id: string;
  text: string;
  createdAt: Date | number;
  user: {
    _id: string;
    name?: string;
    avatar?: string;
  };
  type?: 'offer' | 'answer' | 'candidate';
  payload?: any;
}

// SQLite types
export interface MessageRow {
  id: string;
  channel_id: string;
  text: string;
  created_at: number;
  user_id: string;
  user: string;  // JSON string of user object
  type?: string;
  payload?: string;  // JSON string of payload
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
}

// Type for notification settings
export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
}

// Type for SQLite query results
// export type SQLiteResult = {
//   rows: {
//     length: number;
//     item: (index: number) => any;
//   };
//   insertId: number;
// };
