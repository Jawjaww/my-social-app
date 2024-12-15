import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileUser, NotificationSettings } from "../../types/sharedTypes";

interface ProfileState {
  profile: ProfileUser | null;
  notificationSettings: NotificationSettings;
}

const initialState: ProfileState = {
  profile: null,
  notificationSettings: {
    pushNotifications: true,
    emailNotifications: true
  }
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileUser | null>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<ProfileUser>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setNotificationSettings: (state, action: PayloadAction<NotificationSettings>) => {
      state.notificationSettings = action.payload;
    }
  },
});

export const { setProfile, updateProfile, setNotificationSettings } = profileSlice.actions;

export default profileSlice.reducer;