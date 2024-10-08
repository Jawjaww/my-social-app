import { createSelector } from "@reduxjs/toolkit";
import { RootState } from '../../store/store';
import { ProfileUser } from "../../types/sharedTypes";

const selectProfileState = (state: RootState) => state.profile;

export const selectProfile = createSelector(
  [selectProfileState],
  (profileState): ProfileUser | null => profileState.profile
);

export const selectUsername = createSelector(
  [selectProfile],
  (profile): string | null => profile?.username ?? null
);

export const selectAvatarUri = createSelector(
  [selectProfile],
  (profile): string | null => profile?.avatarUri ?? null
);

export const selectAvatarUrl = createSelector(
  [selectProfile],
  (profile): string | null => profile?.avatarUrl ?? null
);