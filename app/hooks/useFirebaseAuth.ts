import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/authentication/authSlice";
import { setProfile } from "../features/profile/profileSlice";
import { selectProfile } from "../features/profile/profileSelectors";
import { auth } from "../services/firebaseConfig";
import { AppUser, ProfileUser } from "../types/sharedTypes";
import { useGetProfileMutation } from "../services/api";

export const useFirebaseAuth = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile) as ProfileUser | null; // Définir le type de profile
  const [getProfile] = useGetProfileMutation();
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchAndUpdateProfile = useCallback(async (uid: string) => {
    try {
      // If avatarUri is already available in Redux-Persist, do not make a request to Firebase
      if (profile?.avatarUri) {
        console.log("Avatar URI already available in Redux-Persist:", profile.avatarUri);
        return;
      }

      const result = await getProfile(uid).unwrap();
      console.log("Fetched profile from Firebase:", result);

      let profileUser: ProfileUser = {
        uid,
        username: result.username || null,
        avatarUri: result.avatarUri || null,
        bio: result.bio || null,
      };

      console.log("Updating profile in Redux store:", profileUser);
      dispatch(setProfile(profileUser));
    } catch (error) {
      console.error("Error fetching profile from Firebase:", error);
    }
  }, [dispatch, getProfile, profile?.avatarUri]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          emailVerified: firebaseUser.emailVerified,
          isAuthenticated: true,
        };

        dispatch(setUser(appUser));
        await fetchAndUpdateProfile(firebaseUser.uid);
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
  }, [dispatch, fetchAndUpdateProfile, isInitialized]);

  return isInitialized;
};