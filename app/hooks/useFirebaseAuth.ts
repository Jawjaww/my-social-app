import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../features/authentication/authSlice";
import { setProfile } from "../features/profile/profileSlice";
import { auth } from "../services/firebaseConfig";
import { AppUser, ProfileUser } from "../types/sharedTypes";
import { selectProfile } from "../features/profile/profileSelectors";
import { useSelector } from "react-redux";

export const useFirebaseAuth = () => {
  const dispatch = useDispatch();
  const existingProfile = useSelector(selectProfile);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          emailVerified: firebaseUser.emailVerified,
          isAuthenticated: true,
        };
        const profileUser: ProfileUser = {
            uid: firebaseUser.uid,
            username: existingProfile?.username || null,
            avatarUrl: existingProfile?.avatarUrl || null,
            bio: existingProfile?.bio || null,
          };
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
  }, [dispatch]);
};