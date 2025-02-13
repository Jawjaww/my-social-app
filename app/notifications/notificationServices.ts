import { getAuth } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { realtimeDb } from '../services/firebaseConfig';
import { NotificationSettings } from './notificationSlice';

export const updateNotificationSettings = async (settings: NotificationSettings) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const userRef = ref(realtimeDb, `userProfiles/${user.uid}`);

  try {
    await update(userRef, { notificationSettings: settings });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres de notification :", error);
    throw error;
  }
};