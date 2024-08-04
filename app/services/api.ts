import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { app, auth, db } from "./firebaseConfig";
import { applyActionCode } from "firebase/auth";
import { IMessage } from "react-native-gifted-chat";
import { Friend } from "../features/friends/friendsSlice";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    signIn: builder.mutation({
      queryFn: async ({ email, password }) => {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          return { data: user };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),
    getMessages: builder.query<IMessage[], string>({
      query: (userId) => `messages/${userId}`,
    }),
    sendMessage: builder.mutation<
      IMessage,
      { userId: string; message: IMessage }
    >({
      query: ({ userId, message }) => ({
        url: `messages/${userId}`,
        method: "POST",
        body: message,
      }),
    }),
    getFriends: builder.query<Friend[], void>({
      query: () => "friends",
    }),
    addFriend: builder.mutation<Friend, { userId: string }>({
      query: (body) => ({
        url: "friends",
        method: "POST",
        body,
      }),
    }),
    removeFriend: builder.mutation<void, string>({
      query: (userId) => ({
        url: `friends/${userId}`,
        method: "DELETE",
      }),
    }),
    signUp: builder.mutation({
      queryFn: async ({ email, password }) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          return { data: user };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
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
    sendVerificationEmail: builder.mutation<void, void>({
      queryFn: async () => {
        try {
          const user = auth.currentUser;
          if (user) {
            await sendEmailVerification(user);
            return { data: undefined };
          } else {
            throw new Error("No user is currently signed in");
          }
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),
    sendPasswordResetEmail: builder.mutation<void, string>({
      query: (email) => ({
        url: "/sendPasswordResetEmail",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<
      void,
      { oobCode: string; newPassword: string }
    >({
      query: ({ oobCode, newPassword }) => ({
        url: "/resetPassword",
        method: "POST",
        body: { oobCode, newPassword },
      }),
    }),
    signInWithGoogle: builder.mutation<void, string>({
      query: (idToken) => ({
        url: "/signInWithGoogle",
        method: "POST",
        body: { idToken },
      }),
    }),
    verifyEmail: builder.mutation<void, string>({
      queryFn: async (oobCode) => {
        try {
          await applyActionCode(auth, oobCode);
          return { data: undefined };
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
    updateEmail: builder.mutation<void, { newEmail: string; password: string }>(
      {
        query: ({ newEmail, password }) => ({
          url: "/updateEmail",
          method: "POST",
          body: { newEmail, password },
        }),
      }
    ),
    updatePassword: builder.mutation<
      void,
      { currentPassword: string; newPassword: string }
    >({
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
    
          // Mise à jour de l'URL de la photo de profil dans Firestore
          const db = getFirestore();
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, { photoURL: downloadURL });
    
          return { data: downloadURL };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetFriendsQuery,
  useAddFriendMutation,
  useRemoveFriendMutation,
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useSendVerificationEmailMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useSignInWithGoogleMutation,
  useSendPasswordResetEmailMutation,
  useUpdateDisplayNameMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useUpdateProfilePictureMutation,
} = api;
