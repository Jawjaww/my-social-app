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
          title="Se connecter"
          onPress={() => navigation.navigate('SignIn')}
        />
        <Button
          title="S'inscrire"
          onPress={() => navigation.navigate('SignUp')}
        />
        <Button
          title="Se connecter avec Google"
          onPress={() => navigation.navigate('GoogleSignIn')}
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
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
    color: 'gray',
  },
});

export default WelcomeScreen;