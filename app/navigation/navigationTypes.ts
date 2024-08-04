import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  GoogleSignIn: undefined;
  ForgotPassword: undefined;
  ResetPassword: { oobCode: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditEmail: undefined;
  EditPassword: undefined;
  EditDisplayName: undefined;
  EditProfilePicture: undefined;
  VerifyNewEmail: undefined;
  NotificationSettings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
  Message: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  VerifyEmail: { oobCode?: string };
  FriendList: undefined;
  Messages: { friendId: string };
  AddFriend: undefined;
};