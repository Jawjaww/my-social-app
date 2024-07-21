import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { NotificationSettings } from './notificationAtoms';

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