import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRecoilState } from 'recoil';
import { getAuth, signOut } from 'firebase/auth';
import { userState, AppUser } from '../recoil/authAtoms';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [user, setUser] = useRecoilState<AppUser | null>(userState);
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Update user state in Recoil store to null after sign out
    } catch (error) {
      console.error('Erreur de déconnexion :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profil</Text>
      <Text>{user?.displayName}</Text>
      <Text>{user?.email}</Text>
      <Button title="Modifier le profil" onPress={() => navigation.navigate('EditProfile' as never)} />
      <Button title="Préférences de notification" onPress={() => navigation.navigate('NotificationSettings' as never)} />
      <Button title="Se déconnecter" onPress={handleSignOut} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ProfileScreen;
