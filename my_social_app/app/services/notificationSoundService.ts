import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const pickNotificationSound = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      await AsyncStorage.setItem('notificationSound', result.assets[0].uri);
      console.log('Son de notification enregistré :', result.assets[0].uri);
    }
  } catch (err) {
    console.error('Erreur lors de la sélection du son :', err);
  }
};

export default pickNotificationSound;