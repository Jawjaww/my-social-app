import React, { useState } from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from '@emotion/native';
import { useTranslation } from 'react-i18next';
import { useUpdateDisplayNameMutation } from '../../../services/api';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../navigation/navigationTypes";

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
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { t } = useTranslation();
  const [updateDisplayName, { isLoading, error }] = useUpdateDisplayNameMutation();

  const handleSave = async () => {
    if (!displayName) {
      return;
    }

    try {
      await updateDisplayName(displayName).unwrap();
      navigation.goBack();
    } catch (err) {
      console.error(err);
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
      {error && <ErrorText>{(error as any).data?.message || t("editDisplayName.error.generic")}</ErrorText>}
      <Button title={t('editDisplayName.saveButton')} onPress={handleSave} disabled={isLoading} />
    </Container>
  );
};

export default EditDisplayNameScreen;