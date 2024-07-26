import React from "react";
import { Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRecoilState } from "recoil";
import { getAuth, signOut } from "firebase/auth";
import { userState } from "../../authentication/recoil/authAtoms";
import { AppUser } from "../../authentication/authTypes";
import styled from '@emotion/native';
import { handleError } from '../../../services/errorService'; 
import { useTranslation } from 'react-i18next';

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
    const navigation = useNavigation();
    const [user, setUser] = useRecoilState<AppUser | null>(userState);
    const auth = getAuth();
    const { t } = useTranslation();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error(t("auth.error.signOut"), handleError(error));
        }
    };

    return (
        <Container>
            <Header>{t('profile.title')}</Header>
            <Text>{user?.displayName}</Text>
            <Text>{user?.email}</Text>
            <Button title={t('profile.editDisplayName')} onPress={() => navigation.navigate("EditDisplayName" as never)} />
            <Button title={t('profile.editEmail')} onPress={() => navigation.navigate("EditEmail" as never)} />
            <Button title={t('profile.editPassword')} onPress={() => navigation.navigate("EditPassword" as never)} />
            <Button title={t('profile.notificationSettings')} onPress={() => navigation.navigate("NotificationSettings" as never)} />
            <Button title={t('profile.signOut')} onPress={handleSignOut} color="red" />
        </Container>
    );
};

export default ProfileScreen;