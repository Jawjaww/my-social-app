import React, { useState } from 'react';
import { Button } from 'react-native';
import { useRecoilState } from 'recoil';
import { userState } from '../../authentication/recoil/authAtoms';
import { updateUserProfile } from '../services/profileServices';
import styled from '@emotion/native';
import { handleError } from '../../../services/errorService';
import { useTranslation } from 'react-i18next';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Header = styled.Text`
  font-size: 24px;
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
  margin-bottom: 10px;
`;

const EditDisplayNameScreen: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user] = useRecoilState(userState);
  const { t } = useTranslation(); // Initialize useTranslation

  const handleSave = async () => {
    if (!displayName) {
      setError(t("editDisplayName.error.empty")); 
      return;
    }
  
    try {
      if (user) {
        await updateUserProfile(displayName, user.photoURL); 
      } else {
        setError(t("editDisplayName.error.notAuthenticated"));  
      }
    } catch (error) {
      setError(t(handleError(error))); 
    }
  };

  return (
    <Container>
      <Header>{t('editDisplayName.title')}</Header>
      <Input
        placeholder={t('editDisplayName.placeholder')}
        value={displayName}
        onChangeText={setDisplayName}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <Button title={t('editDisplayName.saveButton')} onPress={handleSave} />
    </Container>
  );
};

export default EditDisplayNameScreen;