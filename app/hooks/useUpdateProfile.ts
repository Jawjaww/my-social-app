import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useUpdateUserProfileMutation } from "../services/api";
import { addToast } from "../features/toast/toastSlice";
import { updateProfile } from "../features/profile/profileSlice";
import { AppUser, ProfileUser } from "../types/sharedTypes";

/**
 * Hook to update general user profile information.
 *
 * Recommended usage:
 * - Updating bio
 * - Updating display name (displayName)
 * - Updating unique username (username)
 * - Updating profile sharing preferences
 * - Updating other non-sensitive profile information
 *
 * Do not use for:
 * - Changing password (handled directly in the `updatePassword` mutation in `api.ts`)
 * - Changing email address (handled directly in the `reauthenticateAndUpdateEmail` mutation in `api.ts`)
 *
 * These operations have specific logic integrated in the respective mutations in `api.ts`
 * and are not covered by this general hook.
 */

export const useUpdateProfile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [updateUserProfile] = useUpdateUserProfileMutation();

  const handleUpdateProfile = async (
    user: AppUser,
    updatedProfile: Partial<ProfileUser>
  ) => {
    try {
      const result = await updateUserProfile({
        uid: user.uid,
        ...updatedProfile,
      }).unwrap();

      // update the profile in the redux store
      dispatch(updateProfile(result));
      dispatch(
        addToast({ message: t("profile.updateSuccess"), type: "success" })
      );
      return true;
    } catch (error) {
      dispatch(addToast({ message: t("profile.updateError"), type: "error" }));
      return false;
    }
  };

  return handleUpdateProfile;
};
