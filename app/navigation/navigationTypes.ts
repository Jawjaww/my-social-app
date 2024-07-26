export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  GoogleSignIn: undefined;
  VerifyEmail: undefined;
  Main: undefined;
  VerifyNewEmail: { email: string }; 
  ResetPassword: { token: string };
  ForgotPassword: undefined;
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
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  GoogleSignIn: undefined;
  VerifyEmail: undefined;
  VerifyNewEmail: { email: string }; 
  NotificationSettings: undefined;

};

export type MainStackParamList = {
  Main: undefined;
  Profile: undefined;
  EditDisplayName: undefined;
  EditEmail: undefined;
  EditPassword: undefined;
};

export type SignInScreenProps = {
  navigation: any; 
};

export type SignUpScreenProps = {
  navigation: any; 
};