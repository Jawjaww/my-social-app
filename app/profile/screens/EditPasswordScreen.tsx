import React, { useState } from 'react';
import { Button } from 'react-native';
import { useRecoilState } from 'recoil';
import { userState } from '../../authentication/recoil/authAtoms';
import { getAuth } from 'firebase/auth';
import { handleError } from '../../../services/errorService';
import styled from '@emotion/native';
import useProfileManagement from '../../hooks/useProfileManagement';
import Toast from '../../components/Toast';
import { useTranslation } from 'react-i18next';

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

const EditPasswordScreen: React.FC = () => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user] = useRecoilState(userState);
  const { updatePasswordInProfile } = useProfileManagement();

  const handleUpdatePassword = async () => {
    setError(null);
    if (newPassword !== confirmPassword) {
      setError(t("editPassword.error.mismatch"));
      return;
    }
    if (newPassword.length < 6) {
      setError(t("editPassword.error.short"));
      return;
    }

    const auth = getAuth();
    if (!user) {
      setError(t("editPassword.error.notAuthenticated"));
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError(t("editPassword.error.notAuthenticated"));
      return;
    }

    try {
      const result = await updatePasswordInProfile(currentPassword, newPassword);
      if (result) {
        Toast({ message: t("editPassword.success"), type: 'success' });
      }
    } catch (error) {
      setError(t(handleError(error)));
    }
  };

  return (
    <Container>
      <Header>{t('editPassword.title')}</Header>
      <Input
        placeholder={t('editPassword.currentPassword')}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />
      <Input
        placeholder={t('editPassword.newPassword')}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <Input
        placeholder={t('editPassword.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {error && <ErrorText>{error}</ErrorText>}
      <Button title={t('editPassword.updateButton')} onPress={handleUpdatePassword} />
    </Container>
  );
};

export default EditPasswordScreen;