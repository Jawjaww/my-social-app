import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from './features/authentication/authSelectors';
import { useUpdateContactNotificationTokenMutation } from './services/api';
import { registerForPushNotificationsAsync } from './services/fcmService';
import { app, auth, realtimeDb, storage } from './services/firebaseConfig';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const user = useSelector(selectUser);
  const [updateContactToken] = useUpdateContactNotificationTokenMutation();

  useEffect(() => {
    const initialize = async () => {
      // Verify if Firebase is already initialized
      if (!app) {
        console.error('Firebase app is not initialized');
        return;
      }

      // Update the notification token
      if (user) {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await updateContactToken({ contactUid: user.uid, token });
        }
      }
    };

    initialize();
  }, [user, updateContactToken]);

  return <>{children}</>;
};

export default AppInitializer;