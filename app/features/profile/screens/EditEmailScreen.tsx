import React, { useState } from 'react';
import { Button, ActivityIndicator, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/native';
import { useUpdateEmailMutation } from '../../../services/api';
import Toast from '../../../components/Toast';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../types/sharedTypes";

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
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { t } = useTranslation();
  const [updateEmail, { isLoading, error }] = useUpdateEmailMutation();

  const handleUpdateEmail = async () => {
    if (newEmail !== confirmEmail) {
      Toast({ message: t('editEmail.error.mismatch'), type: 'error' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      Toast({ message: t('editEmail.error.invalid'), type: 'error' });
      return;
    }

    try {
      await updateEmail({ newEmail, password }).unwrap();
      Toast({ message: t('editEmail.success'), type: 'success' });
      navigation.goBack();
    } catch (err) {
      console.error(err);
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
      {error && <ErrorText>{(error as any).data?.message || t("editEmail.error.generic")}</ErrorText>}
      <Button 
        title={t('editEmail.updateButton')} 
        onPress={handleUpdateEmail} 
        disabled={isLoading}
      />
    </Container>
  );
};

export default EditEmailScreen;