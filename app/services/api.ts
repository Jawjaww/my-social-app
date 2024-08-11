import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider, updateProfile, applyActionCode, updatePassword } from "firebase/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { IMessage } from "react-native-gifted-chat";
import { app, auth, db } from "./firebaseConfig";
import { Activity, Contact, User, AppUser } from "../types/sharedTypes";
import { getFirestore, doc, updateDoc, writeBatch, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    addContact: builder.mutation<void, { username: string }>({
      queryFn: async ({ username }, { getState }) => {
        try {
          const currentUser = auth.currentUser;
          if (!currentUser) {
            throw new Error("User not authenticated");
          }
    
          const db = getFirestore();
          const usernameDoc = await getDoc(doc(db, "usernames", username));
    
          if (!usernameDoc.exists()) {
            throw new Error("User not found");
          }
    
          const contactUid = usernameDoc.data().uid;
          const contactRef = doc(db, "contacts", currentUser.uid, "userContacts", contactUid);
          await setDoc(contactRef, { timestamp: serverTimestamp() });
    
          return { data: undefined };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),
    checkUsernameUniqueness: builder.mutation<boolean, string>({
      queryFn: async (username) => {
        const db = getFirestore();
        const usernameDoc = await getDoc(doc(db, "usernames", username));
        return { data: !usernameDoc.exists() };
      },
    }),
    deleteAccount: builder.mutation<{ success: boolean }, { password: string }>({
      queryFn: async ({ password }) => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user || !user.email) {
            throw new Error("No user is currently signed in");
          }
          const credential = EmailAuthProvider.credential(user.email, password);
          await reauthenticateWithCredential(user, credential);
          await user.delete();
          await signOut(auth);
          return { data: { success: true } };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),
    deleteMessage: builder.mutation<void, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
    }),
    getContactActivities: builder.query<Activity[], void>({
      query: () => "contactActivities",
    }),
    getContactSuggestions: builder.query<Contact[], void>({
      query: () => "contactSuggestions",
    }),
    getContacts: builder.query<Contact[], void>({
      query: () => "contacts",
    }),
    getDiscoverUsers: builder.query<User[], void>({
      query: () => "discoverUsers",
    }),
    getMessages: builder.query<IMessage[], string>({
      query: (userId) => `messages/${userId}`,
    }),
    getRecentChats: builder.query<Contact[], void>({
      query: () => "recentChats",
    }),
    getUnreadMessagesCount: builder.query<number, void>({
      query: () => "unreadMessagesCount",
    }),
    removeContact: builder.mutation<void, string>({
      query: (userId) => ({
        url: `contacts/${userId}`,
        method: "DELETE",
      }),
    }),
    resetPassword: builder.mutation<void, { oobCode: string; newPassword: string }>({
      query: ({ oobCode, newPassword }) => ({
        url: "/resetPassword",
        method: "POST",
        body: { oobCode, newPassword },
      }),
    }),
    sendMessage: builder.mutation<IMessage, { userId: string; message: IMessage }>({
      query: ({ userId, message }) => ({
        url: `messages/${userId}`,
        method: "POST",
        body: message,
      }),
    }),
    sendPasswordResetEmail: builder.mutation<void, string>({
      query: (email) => ({
        url: "/sendPasswordResetEmail",
        method: "POST",
        body: { email },
      }),
    }),
    sendVerificationEmail: builder.mutation<{ success: boolean }, void>({
      queryFn: async () => {
        try {
          const user = auth.currentUser;
          if (user) {
            await sendEmailVerification(user);
            return { data: { success: true } };
          } else {
            throw new Error("No user is currently signed in");
          }
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),
    signIn: builder.mutation<AppUser, { email: string; password: string }>({
      queryFn: async ({ email, password }) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          const appUser: AppUser = {
            uid: firebaseUser.uid,
            username: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || null,
            emailVerified: firebaseUser.emailVerified,
            isAuthenticated: true,
          };
          return { data: appUser };
        } catch (error: any) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR',
              error: error.message,
              data: { code: error.code, message: error.message } 
            } 
          };
        }
      },
    }),
    signInWithGoogle: builder.mutation<void, string>({
      query: (idToken) => ({
        url: "/signInWithGoogle",
        method: "POST",
        body: { idToken },
      }),
    }),
    signOut: builder.mutation({
      queryFn: async () => {
        try {
          await signOut(auth);
          return { data: null };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),
    signUp: builder.mutation({
      queryFn: async ({ email, password, username }) => {
        try {
          const db = getFirestore();
          const usernameDoc = await getDoc(doc(db, "usernames", username));
    
          if (usernameDoc.exists()) {
            throw new Error("Username already exists");
          }
    
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
    
          const batch = writeBatch(db);
          batch.set(doc(db, "users", firebaseUser.uid), {
            email: firebaseUser.email,
            username: username,
            photoURL: null,
            emailVerified: firebaseUser.emailVerified,
          });
          batch.set(doc(db, "usernames", username), { uid: firebaseUser.uid });
          await batch.commit();
    
          const appUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            username: username,
            photoURL: null,
            emailVerified: firebaseUser.emailVerified,
            isAuthenticated: true,
          };
          return { data: appUser };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),
    updateusername: builder.mutation<void, string>({
      query: (newusername) => ({
        url: "/updateusername",
        method: "POST",
        body: { username: newusername },
      }),
    }),
    updateEmail: builder.mutation<void, { newEmail: string; password: string }>({
      query: ({ newEmail, password }) => ({
        url: "/updateEmail",
        method: "POST",
        body: { newEmail, password },
      }),
    }),
    updatePassword: builder.mutation<{ success: boolean }, { currentPassword: string; newPassword: string }>({
      queryFn: async ({ currentPassword, newPassword }) => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (!user || !user.email) {
          return { error: { status: 'CUSTOM_ERROR', error: 'User not authenticated' } };
        }
    
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
    
        try {
          await reauthenticateWithCredential(user, credential);
          await updatePassword(user, newPassword);
          return { data: { success: true } };
        } catch (error: any) {
          console.error('Error during password update:', error);
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),
    updateProfilePicture: builder.mutation<string, { uri: string; isPublic: boolean }>({
      queryFn: async ({ uri, isPublic }, { getState }) => {
        try {
          const user = auth.currentUser;
          if (!user) {
            throw new Error("User not authenticated");
          }

          const response = await fetch(uri);
          const blob = await response.blob();

          const storage = getStorage();
          const storageRef = ref(storage, `profile_pictures/${user.uid}/profile.jpg`);

          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);

          // TODO: Update the user's profile picture in Firestore
          const db = getFirestore();
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { photoURL: downloadURL });

          return { data: downloadURL };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),
    verifyEmail: builder.mutation<{ success: boolean; user: AppUser | null }, string>({
      queryFn: async (oobCode) => {
        try {
          await applyActionCode(auth, oobCode);
          const user = auth.currentUser;
          if (user) {
            await user.reload();
            const updatedUser: AppUser = {
              uid: user.uid,
              email: user.email,
              username: user.displayName || user.email?.split('@')[0] || null,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              isAuthenticated: true,
            };
            return { data: { success: true, user: updatedUser } };
          }
          return { data: { success: true, user: null } };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),
  }),
});

export const {
  useAddContactMutation,
  useDeleteAccountMutation,
  useDeleteMessageMutation,
  useGetContactActivitiesQuery,
  useGetContactSuggestionsQuery,
  useGetContactsQuery,
  useGetDiscoverUsersQuery,
  useGetMessagesQuery,
  useGetRecentChatsQuery,
  useGetUnreadMessagesCountQuery,
  useRemoveContactMutation,
  useResetPasswordMutation,
  useSendMessageMutation,
  useSendPasswordResetEmailMutation,
  useSendVerificationEmailMutation,
  useSignInMutation,
  useSignInWithGoogleMutation,
  useSignOutMutation,
  useSignUpMutation,
  useUpdateusernameMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useUpdateProfilePictureMutation,
  useVerifyEmailMutation,
  useCheckUsernameUniquenessMutation,
} = api;
