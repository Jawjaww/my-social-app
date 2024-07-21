import { atom } from 'recoil';

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export const notificationSettingsState = atom<NotificationSettings>({
  key: 'notificationSettingsState',
  default: {
    pushNotifications: true,
    emailNotifications: true,
  },
});