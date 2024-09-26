import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { setUser } from "../features/authentication/authSlice";
import { setProfile } from "../features/profile/profileSlice";
import { ProfileUser } from "../types/sharedTypes";
import { useGetProfileMutation, useDownloadAvatarMutation } from "../services/api";
import * as FileSystem from "expo-file-system";
import { selectProfile } from "../features/profile/profileSelectors";
import { RootState } from "../store/store";

export const useFirebaseAuth = () => {
  const dispatch = useDispatch();
  const [getProfile] = useGetProfileMutation();
  const [downloadAvatar] = useDownloadAvatarMutation();
  const [isInitialized, setIsInitialized] = useState(false);
  const profile = useSelector(selectProfile);
  const isPersisted = useSelector((state: RootState) => state._persist?.rehydrated ?? false);

  const fetchAndUpdateProfile = useCallback(
    async (uid: string) => {
      try {
        const result = await getProfile(uid).unwrap();

        let profileUser: ProfileUser = {
          uid,
          username: result.username || null,
          avatarUri: null, // URI local
          avatarUrl: result.avatarUrl || null, // URL Cloudinary
          bio: result.bio || null,
        };

        // Paths for the user's avatar
        const avatarDir = FileSystem.documentDirectory + "avatars/";
        const userAvatarDir = avatarDir + `${uid}/`;
        const localAvatarPath = `${userAvatarDir}avatar.jpg`;

        // Check if avatar is available locally
        const fileInfo = await FileSystem.getInfoAsync(localAvatarPath);

        if (fileInfo.exists) {
          // Avatar exists locally
          profileUser.avatarUri = localAvatarPath;
        } else if (profileUser.avatarUrl) {
          // Download the avatar from Cloudinary
          const response = await downloadAvatar({ avatarUrl: profileUser.avatarUrl }).unwrap();
          if (response) {
            // Save the downloaded avatar locally
            await FileSystem.makeDirectoryAsync(userAvatarDir, { intermediates: true });
            await FileSystem.downloadAsync(profileUser.avatarUrl, localAvatarPath);
            profileUser.avatarUri = localAvatarPath;
          }
        }

        dispatch(setProfile(profileUser));
      } catch (error) {
        console.error("Error fetching profile from Firebase:", error);
      }
    },
    [dispatch, getProfile, downloadAvatar]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          emailVerified: firebaseUser.emailVerified,
          isAuthenticated: true,
        };

        dispatch(setUser(appUser));
        if (isPersisted && !profile) { // Fetch only if persisted and profile is not in the store
          console.log("Profile absent. Fetching from Firebase...");

          await fetchAndUpdateProfile(firebaseUser.uid);
        }
      } else {
        console.log("No Firebase user authenticated");
        dispatch(setUser(null));
        dispatch(setProfile(null));
      }
      
      if (!isInitialized) {
        setIsInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [dispatch, fetchAndUpdateProfile, isInitialized, profile]);

  return { isInitialized };
}