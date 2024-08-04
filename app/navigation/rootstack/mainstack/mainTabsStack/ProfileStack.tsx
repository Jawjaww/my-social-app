import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../../../../features/profile/screens/ProfileScreen';
import EditEmailScreen from '../../../../features/profile/screens/EditEmailScreen';
import EditPasswordScreen from '../../../../features/profile/screens/EditPasswordScreen';
import EditDisplayNameScreen from '../../../../features/profile/screens/EditDisplayNameScreen';
import EditProfilePictureScreen from '../../../../features/profile/screens/EditProfilePictureScreen';
import VerifyNewEmailScreen from '../../../../features/profile/screens/VerifyNewEmailScreen';
import NotificationSettingsScreen from '../../../../features/profile/screens/NotificationSettingsScreen';
import { ProfileStackParamList } from '../../../navigationTypes';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditEmail" component={EditEmailScreen} />
      <Stack.Screen name="EditPassword" component={EditPasswordScreen} />
      <Stack.Screen name="EditDisplayName" component={EditDisplayNameScreen} />
      <Stack.Screen name="EditProfilePicture" component={EditProfilePictureScreen} />
      <Stack.Screen name="VerifyNewEmail" component={VerifyNewEmailScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;