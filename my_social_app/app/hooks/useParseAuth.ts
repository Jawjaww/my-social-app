import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Parse from 'parse/react-native';
import { setUser } from "../features/authentication/authSlice";
import { setProfile } from "../features/profile/profileSlice";
import { ProfileUser, AppUser } from "../types/sharedTypes";
import { useGetProfileQuery } from "../services/api";
import * as FileSystem from "expo-file-system";
import { selectProfile } from "../features/profile/profileSelectors";
import { RootState } from "../store/store";

export const useParseAuth = () => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const profile = useSelector(selectProfile);
  const isPersisted = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [currentUser, setCurrentUser] = useState<Parse.User | null>(null);

  const { data: profileData } = useGetProfileQuery(currentUser?.id || '', { skip: !currentUser });

  const fetchAndUpdateProfile = useCallback(
    async (user: Parse.User) => {
      try {
        const profile = await Parse.Cloud.run('getUserProfile', { userId: user.id });
        
        if (profile) {
          dispatch(setProfile(profile));
          
          // Download avatar if exists
          if (profile.avatar) {
            try {
              const avatarFile = await Parse.Cloud.run('getAvatarUrl', { avatarId: profile.avatar });
              if (avatarFile) {
                const localUri = `${FileSystem.documentDirectory}avatars/${profile.avatar}`;
                await FileSystem.downloadAsync(avatarFile.url, localUri);
                dispatch(setProfile({ ...profile, localAvatarUri: localUri }));
              }
            } catch (error) {
              console.error("Error downloading avatar:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const subscribeToAuthChanges = async () => {
      if (!isPersisted) return;

      try {
        const currentUser = await Parse.User.currentAsync();
        setCurrentUser(currentUser);
        
        if (currentUser) {
          const appUser: AppUser = {
            uid: currentUser.id,
            email: currentUser.getEmail() || null,
            emailVerified: currentUser.get('emailVerified') || false,
            isAuthenticated: true
          };
          dispatch(setUser(appUser));
          await fetchAndUpdateProfile(currentUser);
        } else {
          dispatch(setUser(null));
          dispatch(setProfile(null));
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Error checking auth state:", error);
        setIsInitialized(true);
      }
    };

    subscribeToAuthChanges();
  }, [dispatch, fetchAndUpdateProfile, isPersisted]);

  return {
    isInitialized,
    currentUser,
    profile: profile as ProfileUser | null
  };
};
