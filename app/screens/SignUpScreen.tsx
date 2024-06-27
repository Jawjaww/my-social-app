import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, UserCredential, AuthError } from 'firebase/auth';
import { app } from '../../services/firebaseconfig';

interface SignUpScreenProps {
  navigation: any;
}

function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const auth = getAuth(app);

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials: UserCredential) => {
        console.log('Compte créé :', userCredentials.user?.email);
        navigation.navigate('SignIn');
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
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="S'inscrire" onPress={handleSignUp} />
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
});

export default SignUpScreen;
