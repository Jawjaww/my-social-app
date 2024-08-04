import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
}

const initialState: NotificationSettings = {
  pushNotifications: true,
  emailNotifications: true,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotificationSettings: (state, action: PayloadAction<NotificationSettings>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setNotificationSettings } = notificationSlice.actions;

export const selectNotificationSettings = (state: RootState) => state.notifications;

export default notificationSlice.reducer;