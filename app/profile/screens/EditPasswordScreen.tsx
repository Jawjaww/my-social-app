import React, { useState } from 'react';
import { Text, Button } from 'react-native';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import styled from '@emotion/native';
import Toast from '../../components/Toast';
import { useUpdatePassword } from '../../hooks';

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
  const [localError, setLocalError] = useState('');
  const { updatePasswordInFirebase, error, success } = useUpdatePassword();

  const handleUpdatePassword = async () => {
    setLocalError('');
    if (newPassword !== confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 6) {
      setLocalError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    const result = await updatePasswordInFirebase(currentPassword, newPassword);
    if (result) {
      Toast({ message: "Mot de passe mis à jour avec succès", type: "success" });
    } else {
      Toast({ message: error || "Échec de la mise à jour du mot de passe", type: "error" });
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
      {localError && <ErrorText>{localError}</ErrorText>}
      <Button title="Mettre à jour" onPress={handleUpdatePassword} />
    </Container>
  );
};

export default EditPasswordScreen;