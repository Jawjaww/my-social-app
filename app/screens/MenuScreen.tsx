import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseconfig';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../navigation/RootStack';

const MenuScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Déconnexion réussie',
          text2: 'Vous avez été déconnecté avec succès.'
        });
        navigation.navigate('SignIn');
      })
      .catch((error) => {
        Toast.show({
          type: 'error',
          text1: 'Erreur de déconnexion',
          text2: error.message
        });
      });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Paramètres"
        onPress={() => navigation.navigate('Settings')}
      />
      <Button
        title="Se déconnecter"
        onPress={handleSignOut}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default MenuScreen;