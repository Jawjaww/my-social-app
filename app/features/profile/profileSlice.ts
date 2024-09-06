import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileUser } from "../../types/sharedTypes";
import { RootState } from "../../store/store";

interface ProfileState {
  profile: ProfileUser | null;
}

const initialState: ProfileState = {
  profile: null,
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
  },
});

export const { setProfile, updateProfile } = profileSlice.actions;

export default profileSlice.reducer;