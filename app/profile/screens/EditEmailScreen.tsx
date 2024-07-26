import React, { useState } from 'react';
import { Button, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/native';
import useProfileManagement from '../../hooks/useProfileManagement';
import Toast from '../../components/Toast';

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
  margin-bottom: 10px;
`;

const EditEmailScreen: React.FC = () => {
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { updateEmailInProfile, error } = useProfileManagement();
  const { t } = useTranslation();

  const validateInputs = () => {
    if (!newEmail || !confirmEmail || !password) {
      return t('editEmail.error.required');
    }
    if (newEmail !== confirmEmail) {
      return t('editEmail.error.mismatch');
    }
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      return t('editEmail.error.invalid');
    }
    return null;
  };

  const handleUpdateEmail = async () => {
    const validationError = validateInputs();
    if (validationError) {
      Toast({ message: validationError, type: 'error' });
      return;
    }

    setIsLoading(true);
    const result = await updateEmailInProfile(newEmail, password);
    setIsLoading(false);

    if (result) {
      Toast({ message: t('editEmail.success'), type: 'success' });
      navigation.goBack();
    } else {
      Toast({ message: error || t('editEmail.error.update'), type: 'error' });
    }
  };

  return (
    <Container>
      <Header>{t('editEmail.title')}</Header>
      <Input
        placeholder={t('editEmail.newEmail')}
        value={newEmail}
        onChangeText={setNewEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder={t('editEmail.confirmEmail')}
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder={t('editEmail.currentPassword')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button 
          title={t('editEmail.updateButton')} 
          onPress={handleUpdateEmail} 
        />
      )}
    </Container>
  );
};

export default EditEmailScreen;