import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const updateUserProfile = async (displayName: string, photoURL: string | null) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  try {
    await updateProfile(user, { displayName, photoURL });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    throw error;
  }
};

export const uploadProfilePicture = async (file: File): Promise<string> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const storage = getStorage();
  const storageRef = ref(storage, `profile_pictures/${user.uid}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Erreur lors de l'upload de la photo de profil :", error);
    throw error;
  }
};