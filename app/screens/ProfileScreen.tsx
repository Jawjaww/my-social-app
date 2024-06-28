import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { getAuth, updateEmail, updatePassword, User } from 'firebase/auth';
import { app, AsyncStorage } from '../../services/firebaseconfig';

const ProfileScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const auth = getAuth(app);
  const user: User | null = auth.currentUser;

  const handleUpdateEmail = () => {
    if (user) {
      updateEmail(user, email)
        .then(() => {
          setSuccess('Email mis à jour avec succès.');
          setError('');
          AsyncStorage.setItem('userEmail', email);
        })
        .catch((error) => {
          setError(error.message);
          setSuccess('');
        });
    }
  };

  const handleUpdatePassword = () => {
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (user) {
      updatePassword(user, password)
        .then(() => {
          setSuccess('Mot de passe mis à jour avec succès.');
          setError('');
        })
        .catch((error) => {
          setError(error.message);
          setSuccess('');
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Modifier le profil</Text>
      <TextInput
        style={styles.input}
        placeholder="Nouvel email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Mettre à jour l'email" onPress={handleUpdateEmail} />
      <TextInput
        style={styles.input}
        placeholder="Nouveau mot de passe"
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
      <Button title="Mettre à jour le mot de passe" onPress={handleUpdatePassword} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}
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
  input: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ProfileScreen;