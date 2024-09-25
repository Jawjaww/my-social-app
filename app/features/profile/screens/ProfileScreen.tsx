import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSignOutMutation } from "../../../services/api";
import { addToast } from "../../toast/toastSlice";
import { selectProfile } from "../../profile/profileSelectors";
import { selectUser } from "../../authentication/authSelectors"; // Importer selectUser
import FastImage from "react-native-fast-image";
import { Ionicons } from "@expo/vector-icons";
import { ProfileScreenProps } from "../../../types/sharedTypes";
import { useTheme } from "@emotion/react";
import styled from "@emotion/native";
import {
  CenteredContainer,
  Container,
  AvatarContainer,
  AvatarImage,
  AvatarPlaceholder,
  AvatarText,
  Card,
  CardText,
} from "../../../components/StyledComponents";
import AvatarPhoto from "../../../components/AvatarPhoto";

const EditAvatarIcon = styled(TouchableOpacity)`
  position: absolute;
  bottom: 1px;
  right: 75px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  padding: 8px;
`;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [signOut, { isLoading }] = useSignOutMutation();
  const [image, setImage] = useState<string | null>(null);
  const username = profile?.username || t("profile.anonymous");
  const email = user?.email;

  const handleSignOut = async () => {
    try {
      await signOut({}).unwrap();
      dispatch(
        addToast({ message: t("profile.signOutSuccess"), type: "success" })
      );
    } catch (error) {
      dispatch(
        addToast({ message: t("profile.error.signOut"), type: "error" })
      );
    }
  };

  return (
    <CenteredContainer>
      <Container>
        <AvatarContainer>
          <AvatarPhoto
            size={220}
            uri={profile?.avatarUri}
            uid={profile?.uid}
            username={profile?.username}
          />
          <EditAvatarIcon onPress={() => navigation.navigate("AvatarManager")}>
            <Ionicons name="create-outline" size={26} color="white" />
          </EditAvatarIcon>
        </AvatarContainer>
        {/* Display username and email under the avatar */}
        <CardText>{username}</CardText>
        {email && <CardText>{email}</CardText>}

        <Card onPress={() => navigation.navigate("ChangeEmail")}>
          <Ionicons
            name="mail-outline"
            size={24}
            color={theme.colors.primary}
          />
          <CardText>{t("profile.changeEmail")}</CardText>
        </Card>

        <Card onPress={() => navigation.navigate("EditPassword")}>
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color={theme.colors.primary}
          />
          <CardText>{t("profile.editPassword")}</CardText>
        </Card>

        <Card onPress={() => navigation.navigate("NotificationSettings")}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={theme.colors.primary}
          />
          <CardText>{t("profile.notificationSettings")}</CardText>
        </Card>

        <Card onPress={() => navigation.navigate("DeleteAccount")}>
          <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
          <CardText>{t("profile.deleteAccount")}</CardText>
        </Card>

        <Card onPress={handleSignOut} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Ionicons
              name="log-out-outline"
              size={24}
              color={theme.colors.primary}
            />
          )}
          <CardText>{t("profile.signOut")}</CardText>
        </Card>
      </Container>
    </CenteredContainer>
  );
};

export default ProfileScreen;
