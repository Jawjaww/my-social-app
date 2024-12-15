import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NotificationService } from '../services/notificationService';

interface NotificationManagerProps {
  children: React.ReactNode;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: any) => state.auth?.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      NotificationService.initialize();
    }
  }, [isAuthenticated]);

  return <>{children}</>;
};

export const getNotificationSettings = async (): Promise<any> => {
  console.log('⚙️ Getting notification settings...');
  // Implémentez la logique pour récupérer les paramètres de notification
  return {
    pushNotifications: true,
    emailNotifications: true
  };
};

export const updateNotificationSettings = async (settings: any): Promise<void> => {
  console.log('⚙️ Updating notification settings:', settings);
  // Implémentez la logique pour mettre à jour les paramètres de notification
  console.log('✅ Notification settings updated');
};

export default NotificationManager;