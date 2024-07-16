import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth, sendEmailVerification, EmailAuthProvider, reauthenticateWithCredential, updateEmail, User } from 'firebase/auth';

const EditEmailScreen: React.FC = () => {
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        // Check if the email is verified and update the email in Firebase
        updateEmailInFirebase(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSendVerificationEmail = async () => {
    if (newEmail !== confirmEmail) {
      setError("Les emails ne correspondent pas");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      setError("Utilisateur non authentifié ou email absent.");
      return;
    }

    try {
      console.log('Reauthenticating user...');
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      console.log('User reauthenticated successfully.');

      console.log('Sending email verification to new email address...');
      await sendEmailVerification(user);
      console.log('Email verification sent successfully.');
      setSuccess('Un email de vérification a été envoyé à votre nouvelle adresse. Veuillez vérifier votre email.');
      setError(null);
    } catch (error) {
      console.error('Error sending verification email:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue s\'est produite.');
      }
    }
  };

  const updateEmailInFirebase = async (user: User) => {
    if (user && user.emailVerified) {
      try {
        console.log('Mise à jour de l\'email dans Firebase...');
        await updateEmail(user, newEmail);
        console.log('Email mise à jour dans Firebase:', newEmail);
        setSuccess('Votre email a été mise à jour avec succès.');
        setError(null);
      } catch (error) {
        console.error('Failed to update email in backend:', error);
        setError('Failed to update email in backend.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Modifier l'Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Nouvel email"
        value={newEmail}
        onChangeText={setNewEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmer nouvel email"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe actuel"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>{success}</Text>}
      <Button title="Envoyer l'email de vérification" onPress={handleSendVerificationEmail} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  success: {
    color: 'green',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default EditEmailScreen;