export type RootStackParamList = {
  Root: undefined;
  Welcome: undefined;
  Auth: undefined;
  Main: undefined;
  SignIn: undefined;
  SignUp: undefined;
  GoogleSignIn: undefined;
  VerifyEmail: { oobCode: string; expired?: boolean };
  ResetPassword: { oobCode: string };
};

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  GoogleSignIn: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  VerifyEmail: { oobCode: string; expired?: boolean };
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  EditDisplayName: undefined;
  EditEmail: undefined;
  EditPassword: undefined;
  EditProfilePicture: undefined;
  MainTabs: undefined;
  Message: undefined;
  NotificationSettings: undefined;
  VerifyEmail: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Profile: undefined;
  EditDisplayName: undefined;
  EditEmail: undefined;
  EditPassword: undefined;
  VerifyNewEmail: { email: string };
};

export type SignInScreenProps = {
  navigation: any;
};

export type SignUpScreenProps = {
  navigation: any;
};