import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import EditEmailScreen from '../screens/EditEmailScreen';
import EditPasswordScreen from '../screens/EditPasswordScreen';
import EditDisplayNameScreen from '../screens/EditDisplayNameScreen';
import EditProfilePictureScreen from '../screens/EditProfilePictureScreen';
import VerifyNewEmailScreen from '../screens/VerifyNewEmailScreen';
import { MainTabParamList } from '../../navigation/navigationTypes';

const Stack = createNativeStackNavigator<MainTabParamList>();

const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditEmail" component={EditEmailScreen} />
      <Stack.Screen name="EditPassword" component={EditPasswordScreen} />
      <Stack.Screen name="EditDisplayName" component={EditDisplayNameScreen} />
      <Stack.Screen name="EditProfilePicture" component={EditProfilePictureScreen} />
      <Stack.Screen name="VerifyNewEmail" component={VerifyNewEmailScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;