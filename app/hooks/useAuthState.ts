import { useEffect, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userState, loadingState } from "../authentication/recoil/authAtoms";
import { auth } from "../../services/firebaseConfig";
import { AppUser } from "../authentication/authTypes";

const useAuthState = () => {
  const setUser = useSetRecoilState(userState);
  const setLoading = useSetRecoilState(loadingState);

  const updateUser = useCallback(
    (firebaseUser: User | null) => {
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        };
        setUser(appUser);
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

export default useAuthState;