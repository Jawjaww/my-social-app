import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword, UserCredential, AuthError } from 'firebase/auth';
import { app } from '../../services/firebaseconfig';
import { NavigationProp } from '@react-navigation/native';

interface SignInScreenProps {
  navigation: NavigationProp<any>;
}

function SignInScreen({ navigation }: SignInScreenProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const auth = getAuth(app);

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials: UserCredential) => {
        console.log('Connecté avec :', userCredentials.user?.email);
        navigation.navigate('Home');
      })
      .catch((error: AuthError) => {
        setError(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Se connecter" onPress={handleSignIn} />
      <Text 
        style={styles.link}
        onPress={() => navigation.navigate('SignUp')}>
        Pas de compte ? S'inscrire
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
  },
  error: {
    color: 'red',
  },
  link: {
    color: 'blue',
    marginTop: 15,
    textAlign: 'center'
  }
});

export default SignInScreen;
