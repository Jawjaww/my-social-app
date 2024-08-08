import React from "react";
import { Text, Button } from "react-native";
import { useSelector } from "react-redux";
import styled from "@emotion/native";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../authentication/authSelectors";
import { useSignOutMutation } from "../../../services/api";
import Toast from "../../../components/Toast";
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, ProfileStackParamList, RootStackParamList } from '../../../navigation/AppNavigation';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Header = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>,
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
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
      <Header>{t("profile.title")}</Header>
      <Text>{t("profile.welcome", { name: user?.displayName })}</Text>
      <Button
  title={t("profile.editEmail")}
  onPress={() => navigation.navigate("EditEmail")}
/>
<Button
  title={t("profile.editPassword")}
  onPress={() => navigation.navigate("EditPassword")}
/>
<Button
  title={t("profile.editProfilePicture")}
  onPress={() => navigation.navigate("EditProfilePicture")}
/>
<Button
  title={t("profile.notificationSettings")}
  onPress={() => navigation.navigate("NotificationSettings")}
/>
<Button
  title={t("profile.deleteAccount")}
  onPress={() => navigation.navigate("DeleteAccount")}
  color="red"
/>
<Button
  title={t("profile.signOut")}
  onPress={handleSignOut}
  color="red"
  disabled={isLoading}
/>
    </Container>
  );
};

export default ProfileScreen;