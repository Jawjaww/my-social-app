import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRecoilState } from "recoil";
import { getAuth, signOut } from "firebase/auth";
import { userState } from "../../authentication/recoil/authAtoms";
import { AppUser } from "../../authentication/authTypes";

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
    <View style={styles.container}>
      <Text style={styles.header}>Profil</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ProfileScreen;
