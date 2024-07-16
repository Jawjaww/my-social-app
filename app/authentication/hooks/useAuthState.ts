import { useEffect, useCallback } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userState, loadingState } from "../recoil/authAtoms";
import { auth } from "../../../services/firebaseConfig";
import { AppUser } from "../authTypes";

export const useAuthState = () => {
  const setUser = useSetRecoilState(userState);
  const setLoading = useSetRecoilState(loadingState);

  const updateUser = useCallback(
    (firebaseUser: User | null) => {
      console.log("Firebase user:", firebaseUser);
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        };
        console.log("App user before setting state:", appUser);
        setUser(appUser);
        console.log("App user state updated:", appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    },
    [setUser, setLoading]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, updateUser);
    return unsubscribe;
  }, [updateUser]);

  const user = useRecoilValue(userState);
  const loading = useRecoilValue(loadingState);

  return { user, loading };
};
