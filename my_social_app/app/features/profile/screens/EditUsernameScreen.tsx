import React, { useState } from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from '@emotion/native';
import { useTranslation } from 'react-i18next';
import { useUpdateusernameMutation } from '../../../services/api';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from '../../../types/sharedTypes';

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

const EditusernameScreen: React.FC = () => {
  const [username, setusername] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { t } = useTranslation();
  const [updateusername, { isLoading, error }] = useUpdateusernameMutation();

  const handleSave = async () => {
    if (!username) {
      return;
    }

    try {
      await updateusername(username).unwrap();
      navigation.goBack();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Header>{t('editusername.title')}</Header>
      <Input
        placeholder={t('editusername.placeholder')}
        value={username}
        onChangeText={setusername}
      />
      {error && <ErrorText>{(error as any).data?.message || t("editusername.error.generic")}</ErrorText>}
      <Button title={t('editusername.saveButton')} onPress={handleSave} disabled={isLoading} />
    </Container>
  );
};

export default EditusernameScreen;