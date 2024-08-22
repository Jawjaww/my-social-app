import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "@emotion/native";
import { selectUser } from "../../authentication/authSelectors";
import { useSignOutMutation } from "../../../services/api";
import { addToast } from "../../toast/toastSlice";
import { ProfileScreenProps } from "../../../types/sharedTypes";
import {
  Container,
  Header,
  Button,
  ButtonText,
} from "../../../components/StyledComponents";

const ProfileContainer = styled(Container)`
  justify-content: space-between;
`;

const UserInfo = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.xl}px;
  flex: 1;
`;

const UserName = styled.Text`
  font-size: ${(props) => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
  margin-top: ${(props) => props.theme.spacing.sm}px;
`;

const ButtonContainer = styled.View`
  padding-vertical: ${(props) => props.theme.spacing.xl}px;
  width: 100%;
  align-items: center;
`;

const ProfileButton = styled(Button)`
  margin-bottom: 24px;
  padding: 10px 32px;
  background-color: ${(props) =>
    props.variant === "secondary" ? "#5856D6" : "#007AFF"};
  border-radius: 3px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  align-items: center;
  justify-content: center;
`;

const ProfileButtonText = styled(ButtonText)`
  font-size: ${(props) => props.theme.fontSizes.large}px;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
`;

const MainButtonsContainer = styled.View`
  margin-bottom: ${(props) => props.theme.spacing.xl * 8}px;
`;

const SecondaryButtonsContainer = styled.View`
  margin-top: ${(props) => props.theme.spacing.xl * 2}px;
`;

const AvatarContainer = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: ${(props) => props.theme.colors.secondary};
  justify-content: center;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const AvatarText = styled.Text`
  font-size: ${(props) => props.theme.fontSizes.xlarge}px;
  color: white;
  font-weight: bold;
`;

const UserEmail = styled.Text`
  font-size: ${(props) => props.theme.fontSizes.medium}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: ${(props) => props.theme.spacing.xs}px;
`;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [signOut, { isLoading }] = useSignOutMutation();

  const username = user?.username || t("profile.anonymous");
  console.log("username", username);
  const handleSignOut = async () => {
    try {
      await signOut({}).unwrap();
    } catch (error) {
      dispatch(
        addToast({ message: t("profile.error.signOut"), type: "error" })
      );
    }
  };

  return (
    <ProfileContainer>
      <UserInfo>
        <AvatarContainer>
          <AvatarText>{username[0].toUpperCase() || "?"}</AvatarText>
        </AvatarContainer>
        <UserName>{username}</UserName>
        <UserEmail>{user?.email || t("profile.emailNotAvailable")}</UserEmail>
      </UserInfo>
      <ButtonContainer>
        <MainButtonsContainer>
          <ProfileButton
            onPress={() => navigation.navigate("EditProfilePicture")}
          >
            <ProfileButtonText>
              {t("profile.editProfilePicture")}
            </ProfileButtonText>
          </ProfileButton>
          <ProfileButton onPress={() => navigation.navigate("ChangeEmail")}>
            <ProfileButtonText>{t("profile.changeEmail")}</ProfileButtonText>
          </ProfileButton>
          <ProfileButton onPress={() => navigation.navigate("EditPassword")}>
            <ProfileButtonText>{t("profile.editPassword")}</ProfileButtonText>
          </ProfileButton>
          <ProfileButton
            onPress={() => navigation.navigate("NotificationSettings")}
          >
            <ProfileButtonText>
              {t("profile.notificationSettings")}
            </ProfileButtonText>
          </ProfileButton>
        </MainButtonsContainer>
        <SecondaryButtonsContainer>
          <ProfileButton
            variant="secondary"
            onPress={() => navigation.navigate("DeleteAccount")}
          >
            <ProfileButtonText>{t("profile.deleteAccount")}</ProfileButtonText>
          </ProfileButton>
          <ProfileButton
            variant="secondary"
            onPress={handleSignOut}
            disabled={isLoading}
          >
            <ProfileButtonText>{t("profile.signOut")}</ProfileButtonText>
          </ProfileButton>
        </SecondaryButtonsContainer>
      </ButtonContainer>
    </ProfileContainer>
  );
};

export default ProfileScreen;
