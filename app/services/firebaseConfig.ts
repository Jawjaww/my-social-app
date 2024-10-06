import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  API_KEY,
  AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  GOOGLE_CLIENT_ID,
  SENTRY_DSN,
  DATABASE_URL,
} from "@env";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  googleClientId: GOOGLE_CLIENT_ID,
  sentryDsn: SENTRY_DSN,
  databaseURL: DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const realtimeDb = getDatabase(app);
const storage = getStorage(app);

// Initialiser messaging seulement si la plateforme le supporte
// let messagingInstance;
// if (Platform.OS !== 'web') {
//   messagingInstance = getMessaging(app);
// }

export { app, auth, realtimeDb, storage };