import { applyActionCode } from "firebase/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { IMessage } from "react-native-gifted-chat";
import { app, auth, db } from "./firebaseConfig";
import { Activity, Contact, User } from "../types/sharedTypes";
import { AppUser } from "../features/authentication/authTypes";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    addContact: builder.mutation<Contact, { userId: string }>({
      query: (body) => ({
        url: "contacts",
        method: "POST",
        body,
      }),
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
    setPseudo: builder.mutation<void, string>({
      query: (pseudo) => ({
        url: "/setPseudo",
        method: "POST",
        body: { pseudo },
      }),
    }),
    signIn: builder.mutation<AppUser, { email: string; password: string }>({
      queryFn: async ({ email, password }) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          const appUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || null,
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
      queryFn: async ({ email, password }) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          const serializableUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
          };
          return { data: serializableUser };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),
    updateDisplayName: builder.mutation<void, string>({
      query: (newDisplayName) => ({
        url: "/updateDisplayName",
        method: "POST",
        body: { displayName: newDisplayName },
      }),
    }),
    updateEmail: builder.mutation<void, { newEmail: string; password: string }>({
      query: ({ newEmail, password }) => ({
        url: "/updateEmail",
        method: "POST",
        body: { newEmail, password },
      }),
    }),
    updatePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: ({ currentPassword, newPassword }) => ({
        url: "/updatePassword",
        method: "POST",
        body: { currentPassword, newPassword },
      }),
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
              displayName: user.displayName,
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
  useSetPseudoMutation,
  useSignInMutation,
  useSignInWithGoogleMutation,
  useSignOutMutation,
  useSignUpMutation,
  useUpdateDisplayNameMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useUpdateProfilePictureMutation,
  useVerifyEmailMutation,
} = api;
