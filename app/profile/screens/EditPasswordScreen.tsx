import React, { useState } from 'react';
import { Text, Button } from 'react-native';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import styled from '@emotion/native';

const Container = styled.View`
  flex: 1;
  padding: 20px;
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

const EditPasswordScreen: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (user && user.email) {
      try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setSuccess("Votre mot de passe a été mis à jour avec succès.");
        setError(null);
      } catch (error) {
        console.error('Erreur de mise à jour du mot de passe :', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Une erreur inconnue s\'est produite.');
        }
      }
    } else {
      setError("Utilisateur non authentifié.");
    }
  };

  return (
    <Container>
      <Header>Modifier le Mot de Passe</Header>
      <Input
        placeholder="Mot de passe actuel"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />
      <Input
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <Input
        placeholder="Confirmer le nouveau mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessText>{success}</SuccessText>}
      <Button title="Enregistrer" onPress={handleSave} />
    </Container>
  );
};

export default EditPasswordScreen;