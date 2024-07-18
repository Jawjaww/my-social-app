import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { getAuth, sendEmailVerification, EmailAuthProvider, reauthenticateWithCredential, updateEmail, User } from 'firebase/auth';
import styled from '@emotion/native';

const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
`;

const Header = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Input = styled.TextInput`
  height: 40px;
  border-color: gray;
  border-width: 1px;
  margin-bottom: 20px;
  padding-horizontal: 10px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 20px;
  text-align: center;
`;

const SuccessText = styled.Text`
  color: green;
  margin-bottom: 20px;
  text-align: center;
`;

const EditEmailScreen: React.FC = () => {
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.emailVerified && newEmail) {
        // Check if the email is verified and update the email in Firebase
        updateEmailInFirebase(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [newEmail]);

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
    <Container>
      <Header>Modifier l'Email</Header>
      <Input
        placeholder="Nouvel email"
        value={newEmail}
        onChangeText={setNewEmail}
      />
      <Input
        placeholder="Confirmer nouvel email"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
      />
      <Input
        placeholder="Mot de passe actuel"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessText>{success}</SuccessText>}
      <Button title="Envoyer l'email de vérification" onPress={handleSendVerificationEmail} />
    </Container>
  );
}

export default EditEmailScreen;