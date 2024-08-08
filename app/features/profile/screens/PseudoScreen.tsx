import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSetPseudoMutation } from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigation';
import Toast from '../../../components/Toast';

const PseudoScreen = () => {
  const [pseudo, setPseudo] = useState('');
  const { t } = useTranslation();
  const [setPseudoMutation, { isLoading, error }] = useSetPseudoMutation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Auth'>>();

  const handleSetPseudo = async () => {
    if (pseudo.trim().length === 0) {
      Toast({ message: t('choosePseudo.emptyError'), type: 'error' });
      return;
    }

    try {
      await setPseudoMutation(pseudo).unwrap();
      Toast({ message: t('choosePseudo.success'), type: 'success' });
navigation.navigate('Main', { screen: 'Home' });
    } catch (err) {
      Toast({ message: t('choosePseudo.error'), type: 'error' });
    }
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        {t('choosePseudo.title')}
      </Text>
      <TextInput
        value={pseudo}
        onChangeText={setPseudo}
        placeholder={t('choosePseudo.placeholder')}
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 20 }}
      />
      <Button
        title={t('choosePseudo.submit')}
        onPress={handleSetPseudo}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {error && <Text style={{ color: 'red', marginTop: 10 }}>{t('choosePseudo.error')}</Text>}
    </View>
  );
};

export default PseudoScreen;