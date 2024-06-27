import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootStack';

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bienvenue sur ChatApp!</Text>
      <Text style={styles.introText}>
        Découvrez les meilleures façons de rester connecté avec vos amis et votre famille.
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Commencer à chatter"
          onPress={() => navigation.navigate('Chat')}
        />
        <Button
          title="Modifier le profil"
          onPress={() => navigation.navigate('Profile')}
        />
        <Button
          title="Groupes"
          onPress={() => navigation.navigate('Menu')}
        />
        <Button
          title="Paramètres"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <Text style={styles.footerText}>
        Besoin d'aide? Visitez notre section support.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  introText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});

export default WelcomeScreen;