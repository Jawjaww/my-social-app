import React, { useCallback } from 'react';
import { View, Button, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRecoilState } from 'recoil';
import { getAuth, signOut, User } from 'firebase/auth';
import { userState } from '../recoil/authAtoms';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useRecoilState<User | null>(userState);
  const auth = getAuth();

  const handleSignOut = useCallback(() => {
    console.log('Attempting to sign out...');

    if (auth.currentUser) {
      signOut(auth)
        .then(() => {
          console.log('Sign out successful');
          setUser(null);
        })
        .catch((error) => {
          console.error('Sign out error:', error.message);
        });
    } else {
      console.log('No user signed in.');
    }
  }, [auth, setUser]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profil</Text>
      <TouchableOpacity onPress={() => navigation.navigate('EditProfile' as never)}>
        <Image source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
      </TouchableOpacity>
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
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default ProfileScreen;
