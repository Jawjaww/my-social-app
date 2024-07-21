import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useRecoilState } from "recoil";
import { userState } from "../authentication/recoil/authAtoms";

const useReloadUser = () => {
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [, setUser] = useRecoilState(userState);

  const reloadUser = async () => {
    setReloading(true);
    setError(null);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await user.reload();
        const updatedUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        };
        console.log("Updated user:", updatedUser);
        setUser(updatedUser);
      } catch (err) {
        setError(err as Error);
      }
    }
    setReloading(false);
  };

  return [reloadUser, reloading, error] as const;
};

export default useReloadUser;