import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { setUser } from "../features/authentication/authSlice";
import { setProfile } from "../features/profile/profileSlice";
import { ProfileUser } from "../types/sharedTypes";
import { useGetUserProfileQuery, useDownloadAvatarMutation } from "../services/api";
import * as FileSystem from "expo-file-system";
import { selectProfile } from "../features/profile/profileSelectors";
import { RootState } from "../store/store";

export const useFirebaseAuth = () => {
  const dispatch = useDispatch();
  const [downloadAvatar] = useDownloadAvatarMutation();
  const [isInitialized, setIsInitialized] = useState(false);
  const profile = useSelector(selectProfile);
  const isPersisted = useSelector((state: RootState) => state._persist?.rehydrated ?? false);
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  const { data: profileData, error } = useGetUserProfileQuery(currentUid || '', { skip: !currentUid });

  const fetchAndUpdateProfile = useCallback(
    async (uid: string) => {
      setCurrentUid(uid);

      if (error) {
        console.error("Error fetching profile from Firebase:", error);
        return;
      }

      if (!profileData) {
        console.log("No profile data found");
        return;
      }

      try {
        let profileUser: ProfileUser = {
          uid,
          username: profileData.username || null,
          avatarUri: null,
          avatarUrl: profileData.avatarUrl || null,
          bio: profileData.bio || null,
          isSignUpComplete: profileData.isSignUpComplete || false,
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
        console.error("Error processing profile data:", error);
      }
    },
    [dispatch, downloadAvatar, profileData, error]
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
        if (isPersisted && !profile) {
          console.log("Profile absent. Fetching from Firebase...");
          setCurrentUid(firebaseUser.uid);
        }
      } else {
        console.log("No Firebase user authenticated");
        dispatch(setUser(null));
        dispatch(setProfile(null));
        setCurrentUid(null);
      }
      
      if (!isInitialized) {
        setIsInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [dispatch, isInitialized, profile, isPersisted]);

  useEffect(() => {
    if (currentUid && !profile) {
      console.log("Fetching profile for UID:", currentUid);
      fetchAndUpdateProfile(currentUid);
    } else if (profile) {
      // console.log("Profile loaded:", profile);
    }
  }, [currentUid, profile, fetchAndUpdateProfile]);

  return { isInitialized };
};