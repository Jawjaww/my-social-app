import { getAuth, signOut } from "firebase/auth";

// This function signs out the current user and updates the user state to null
export const signOutUser = async (setUser: (user: null) => void) => {
  const auth = getAuth();
  try {
    await signOut(auth);
    setUser(null);
  } catch (error) {
    console.error("Erreur de déconnexion :", error);
  }
};
