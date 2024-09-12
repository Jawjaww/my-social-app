import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../features/authentication/authSlice";
import { setProfile } from "../features/profile/profileSlice";
import { auth } from "../services/firebaseConfig";
import { AppUser, ProfileUser } from "../types/sharedTypes";
import { useGetProfileMutation } from "../services/api";

export const useFirebaseAuth = () => {
  const dispatch = useDispatch();
  const [getProfile] = useGetProfileMutation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          emailVerified: firebaseUser.emailVerified,
          isAuthenticated: true,
        };

        let profileUser: ProfileUser = {
          uid: firebaseUser.uid,
          username: null,
          avatarUri: null,
          bio: null,
        };

        try {
          const result = await getProfile(firebaseUser.uid).unwrap();
          profileUser = {
            ...profileUser,
            username: result.username,
            avatarUri: result.avatarUri,
            bio: result.bio,
          };
        } catch (error) {
          console.error("Error fetching profile from Firebase:", error);
        }

        console.log("Firebase user authenticated:", appUser);
        console.log("Profile user state before dispatch:", profileUser);
        dispatch(setUser(appUser));
        dispatch(setProfile(profileUser));
      } else {
        console.log("No Firebase user authenticated");
        dispatch(setUser(null));
        dispatch(setProfile(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch, getProfile]);
};