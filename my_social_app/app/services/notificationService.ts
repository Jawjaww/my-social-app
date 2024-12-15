import messaging from '@react-native-firebase/messaging';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ParseService } from '../config/parse';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  initialize: async () => {
    console.log('🔔 Initializing notifications...');
    
    if (!Device.isDevice) {
      console.log('❌ Must use physical device for Push Notifications');
      return false;
    }

    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('✅ Push notifications enabled');
        await NotificationService.updateToken();
        NotificationService.setupListeners();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Notification initialization error:', error);
      return false;
    }
  },

  setupListeners: () => {
    // Écouter les messages en premier plan
    messaging().onMessage(async remoteMessage => {
      if (Platform.OS === 'ios') {
        await Notifications.presentNotificationAsync({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          data: remoteMessage.data,
        });
      }
    });

    // Écouter le rafraîchissement du token
    messaging().onTokenRefresh(async token => {
      await ParseService.updateFCMToken(token);
    });
  },

  updateToken: async () => {
    const token = await messaging().getToken();
    await ParseService.updateFCMToken(token);
    return token;
  }
};
