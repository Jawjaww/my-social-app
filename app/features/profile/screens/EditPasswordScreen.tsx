import React, { useState } from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/native';
import { useUpdatePasswordMutation } from '../../../services/api';
import Toast from '../../../components/Toast';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../navigation/AppNavigation";

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
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [updatePassword, { isLoading, error }] = useUpdatePasswordMutation();

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Toast({ message: t("editPassword.error.mismatch"), type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      Toast({ message: t("editPassword.error.short"), type: 'error' });
      return;
    }

    try {
      await updatePassword({ currentPassword, newPassword }).unwrap();
      Toast({ message: t("editPassword.success"), type: 'success' });
      navigation.goBack();
    } catch (err) {
      console.error(err);
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
      {error && <ErrorText>{(error as any).data?.message || t("editPassword.error.generic")}</ErrorText>}
      <Button 
        title={t('editPassword.updateButton')} 
        onPress={handleUpdatePassword}
        disabled={isLoading}
      />
    </Container>
  );
};

export default EditPasswordScreen;