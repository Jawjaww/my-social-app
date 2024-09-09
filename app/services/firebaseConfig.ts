import { initializeApp } from "firebase/app";
// import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
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
import { ref, set, get } from "firebase/database";

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

// Update user profile in realtime database and Firebase Authentication
// export const updateUserProfile = async (user: ProfileUser) => {
//   const userRef = ref(realtimeDb, `users/${user.uid}`);
//   const usernameRef = ref(realtimeDb, `usernames/${user.username}`);

//   // Update user profile in realtime database
//   await set(userRef, {
//     username: user.username,
//     avatarUrl: user.avatarUrl,
//   });

//   await set(usernameRef, user.uid);

//   // Update user profile in Firebase Authentication
//   const authUser = auth.currentUser;
//   if (authUser) {
//     await updateProfile(authUser, {
//       displayName: user.username || undefined,
//       photoURL: user.avatarUrl || undefined,
//     });
//   }
// };

export { app, auth, realtimeDb, storage };
