import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRecoilState } from "recoil";
import { getAuth, signOut } from "firebase/auth";
import { userState } from "../../authentication/recoil/authAtoms";
import { AppUser } from "../../authentication/authTypes";
import styled from '@emotion/native';

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  return (
    <Container>
      <Header>Profil</Header>
      <Text>{user?.displayName}</Text>
      <Text>{user?.email}</Text>
      <Button
        title="Modifier le pseudo"
        onPress={() => navigation.navigate("EditDisplayName" as never)}
      />
      <Button
        title="Modifier l'email"
        onPress={() => navigation.navigate("EditEmail" as never)}
      />
      <Button
        title="Modifier le mot de passe"
        onPress={() => navigation.navigate("EditPassword" as never)}
      />
      <Button
        title="Préférences de notification"
        onPress={() => navigation.navigate("NotificationSettings" as never)}
      />
      <Button title="Se déconnecter" onPress={handleSignOut} color="red" />
    </Container>
  );
};

export default ProfileScreen;