import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRecoilState } from 'recoil';
import { userState } from '../../authentication/recoil/authAtoms';
import { updateUserProfile } from '../../../services/profileServices';
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

const EditDisplayNameScreen: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [displayName, setDisplayName] = useState('');

  const handleSave = async () => {
    try {
      await updateUserProfile(displayName, user?.photoURL || null);
      if (user) {
        setUser({ ...user, displayName: displayName });
      }
    } catch (error) {
      console.error('Erreur de mise à jour du pseudo :', error);
    }
  };

  return (
    <Container>
      <Header>Modifier le Pseudo</Header>
      <Input
        placeholder="Nouveau pseudo"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <Button title="Enregistrer" onPress={handleSave} />
    </Container>
  );
};

export default EditDisplayNameScreen;