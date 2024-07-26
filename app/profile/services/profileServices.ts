import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { NotificationSettings } from '../../notifications/notificationAtoms';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth'; 


// Update user profile information
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

// Upload a profile picture and return the download URL
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

// Update notification settings for the user
export const updateNotificationSettings = async (settings: NotificationSettings) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);

  try {
    await updateDoc(userRef, { notificationSettings: settings });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres de notification :", error);
    throw error;
  }
};

// Update user password
export const updatePasswordInFirebase = async (newPassword: string) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe :", error);
    throw error;
  }
};