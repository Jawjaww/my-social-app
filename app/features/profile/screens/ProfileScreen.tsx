import React from "react";
import { Text, Button, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import styled from '@emotion/native';
import { useTranslation } from 'react-i18next';
import { selectUser } from "../../authentication/authSelectors";
import { useSignOutMutation } from "../../../services/api";
import Toast from "../../../components/Toast";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../navigation/navigationTypes";

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Header = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const user = useSelector(selectUser);
  const { t } = useTranslation();
  const [signOut, { isLoading }] = useSignOutMutation();

  const handleSignOut = async () => {
    try {
      await signOut({}).unwrap();   // Redirection will be handled by the auth listener that is in the App.tsx file
    } catch (error) {
      Toast({ message: t("profile.error.signOut"), type: "error" });
    }
  };

  return (
    <Container>
      <Header>{t('profile.title')}</Header>
      <Text>{user?.displayName}</Text>
      <Text>{user?.email}</Text>
      <Button title={t('profile.editDisplayName')} onPress={() => navigation.navigate("EditDisplayName")} />
      <Button title={t('profile.editEmail')} onPress={() => navigation.navigate("EditEmail")} />
      <Button title={t('profile.editPassword')} onPress={() => navigation.navigate("EditPassword")} />
      <Button title={t('profile.editProfilePicture')} onPress={() => navigation.navigate("EditProfilePicture")} />
      <Button title={t('profile.notificationSettings')} onPress={() => navigation.navigate("NotificationSettings")} />
      <Button title={t('profile.signOut')} onPress={handleSignOut} color="red" disabled={isLoading} />
    </Container>
  );
};

export default ProfileScreen;