import {
  ActionCodeSettings,
  confirmPasswordReset,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  applyActionCode,
  updatePassword,
  verifyBeforeUpdateEmail,
  updateEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { IMessage } from "react-native-gifted-chat";
import { app, auth, db } from "./firebaseConfig";
import { Activity, Contact, User, AppUser } from "../types/sharedTypes";
import {
  getFirestore,
  doc,
  updateDoc,
  writeBatch,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { selectPendingNewEmail } from "../features/profile/profileSlice";
import { setUser } from "../features/authentication/authSlice";
import { setIsAwaitingEmailVerification } from "../../app/features/authentication/authSlice";

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
          const contactRef = doc(
            db,
            "contacts",
            currentUser.uid,
            "userContacts",
            contactUid
          );
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
    deleteAccount: builder.mutation<{ success: boolean }, { password: string }>(
      {
        queryFn: async ({ password }) => {
          try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user || !user.email) {
              throw new Error("No user is currently signed in");
            }
            const credential = EmailAuthProvider.credential(
              user.email,
              password
            );
            await reauthenticateWithCredential(user, credential);
            await user.delete();
            await signOut(auth);
            return { data: { success: true } };
          } catch (error: any) {
            return { error: { status: "CUSTOM_ERROR", error: error.message } };
          }
        },
      }
    ),
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
    resetPassword: builder.mutation<
      { success: boolean },
      { oobCode: string; newPassword: string }
    >({
      queryFn: async ({ oobCode, newPassword }) => {
        try {
          await confirmPasswordReset(auth, oobCode, newPassword);
          return { data: { success: true } };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
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
    sendPasswordResetEmail: builder.mutation<{ success: boolean }, string>({
      queryFn: async (email) => {
        try {
          const auth = getAuth();
          await sendPasswordResetEmail(auth, email);
          return { data: { success: true } };
        } catch (error) {
          if (error instanceof FirebaseError) {
            let errorMessage: string;
            switch (error.code) {
              case "auth/user-not-found":
                errorMessage = "forgotPassword.error.userNotFound";
                break;
              case "auth/invalid-email":
                errorMessage = "forgotPassword.error.invalidEmail";
                break;
              default:
                errorMessage = "forgotPassword.error.generic";
            }
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: errorMessage,
                data: { message: errorMessage },
              },
            };
          }
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "forgotPassword.error.generic",
              data: { message: "forgotPassword.error.generic" },
            },
          };
        }
      },
    }),
    sendVerificationEmail: builder.mutation<
      { success: boolean; message?: string },
      void
    >({
      queryFn: async (_, { getState }) => {
        try {
          const user = auth.currentUser;

          if (!user) throw new Error("No user is currently signed in");
          await sendEmailVerification(user);
          return {
            data: {
              success: true,
              message: "Verification email sent successfully",
            },
          };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),

    signIn: builder.mutation<AppUser, { email: string; password: string }>({
      queryFn: async ({ email, password }) => {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const firebaseUser = userCredential.user;
          const appUser: AppUser = {
            uid: firebaseUser.uid,
            username: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL || null,
            emailVerified: firebaseUser.emailVerified,
            isAuthenticated: true,
          };
          return { data: appUser };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message,
              data: { code: error.code, message: error.message },
            },
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
    signUp: builder.mutation<AppUser, { email: string; password: string }>({
      queryFn: async ({ email, password }) => {
        try {
          const auth = getAuth();
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const firebaseUser = userCredential?.user;

          if (!firebaseUser) {
            throw new Error("Failed to create user");
          }

          const appUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            username: null,
            photoURL: null,
            emailVerified: firebaseUser.emailVerified,
            isAuthenticated: true,
          };
          return { data: appUser };
        } catch (error: any) {
          console.error("Erreur lors de l'inscription:", error);
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message,
              code: error.code || "unknown",
            },
          };
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
    updatePassword: builder.mutation<
      { success: boolean },
      { currentPassword: string; newPassword: string }
    >({
      queryFn: async ({ currentPassword, newPassword }) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !user.email) {
          return {
            error: { status: "CUSTOM_ERROR", error: "User not authenticated" },
          };
        }

        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );

        try {
          await reauthenticateWithCredential(user, credential);
          await updatePassword(user, newPassword);
          return { data: { success: true } };
        } catch (error: any) {
          console.error("Error during password update:", error);
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),
    updateProfilePicture: builder.mutation<
      string,
      { uri: string; isPublic: boolean }
    >({
      queryFn: async ({ uri, isPublic }, { getState }) => {
        try {
          const user = auth.currentUser;
          if (!user) {
            throw new Error("User not authenticated");
          }

          const response = await fetch(uri);
          const blob = await response.blob();

          const storage = getStorage();
          const storageRef = ref(
            storage,
            `profile_pictures/${user.uid}/profile.jpg`
          );

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
    updateEmail: builder.mutation<
      { success: boolean; user: AppUser | null },
      { newEmail: string; password: string }
    >({
      queryFn: async ({ newEmail, password }) => {
        try {
          const user = auth.currentUser;
          if (user) {
            await reauthenticateWithCredential(
              user,
              EmailAuthProvider.credential(user.email!, password)
            );
            await sendEmailVerification(user);
            await updateEmail(user, newEmail);

            const updatedUser: AppUser = {
              uid: user.uid,
              email: newEmail,
              username: user.displayName || newEmail.split("@")[0] || null,
              photoURL: user.photoURL,
              emailVerified: false,
              isAuthenticated: true,
              isAwaitingEmailVerification: true,
            };

            return { data: { success: true, user: updatedUser } };
          }
          return { data: { success: false, user: null } };
        } catch (error: unknown) {
          console.error("Error in updateEmail mutation:", error);
          if (error instanceof Error) {
            return { error: { status: "CUSTOM_ERROR", error: error.message } };
          } else {
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: "An unknown error occurred",
              },
            };
          }
        }
      },
    }),

    verifyEmail: builder.mutation<
      { success: boolean; user: AppUser | null; newEmail: string | null },
      string
    >({
      queryFn: async (oobCode) => {
        try {
          await applyActionCode(auth, oobCode);
          const user = auth.currentUser;
          if (user) {
            await user.reload();
            const updatedUser: AppUser = {
              uid: user.uid,
              email: user.email,
              username: user.displayName || user.email?.split("@")[0] || null,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              isAuthenticated: true,
            };
            return {
              data: { success: true, user: updatedUser, newEmail: user.email },
            };
          }
          return { data: { success: true, user: null, newEmail: null } };
        } catch (error: unknown) {
          console.error("Erreur dans la mutation verifyEmail:", error);
          if (error instanceof Error) {
            return { error: { status: "CUSTOM_ERROR", error: error.message } };
          } else {
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: "Une erreur inconnue s'est produite",
              },
            };
          }
        }
      },
    }),

    VerifyBeforeUpdateEmail: builder.mutation<
      { success: boolean },
      { newEmail: string; password: string }
    >({
      queryFn: async ({ newEmail, password }) => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) {
            throw new Error("No user is currently signed in");
          }

          // Reauthenticate the user
          const credential = EmailAuthProvider.credential(
            user.email!,
            password
          );
          await reauthenticateWithCredential(user, credential);

          // Configure the action code settings
          const actionCodeSettings: ActionCodeSettings = {
            url: `https://mysocialapp.expo.dev/verify-new-email?email=${encodeURIComponent(
              newEmail
            )}`,
            handleCodeInApp: true,
          };

          // Send verification mail to the new one
          await verifyBeforeUpdateEmail(user, newEmail, actionCodeSettings);

          return { data: { success: true } };
        } catch (error: unknown) {
          console.error("Error in sendVerificationEmail mutation:", error);
          if (error instanceof Error) {
            return { error: { status: "CUSTOM_ERROR", error: error.message } };
          } else {
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: "An unknown error occurred",
              },
            };
          }
        }
      },
    }),

    verifyNewEmail: builder.mutation<
      { success: boolean; user: AppUser | null; newEmail: string | null },
      { oobCode: string }
    >({
      queryFn: async ({ oobCode }, { getState }) => {
        console.log("Début de verifyNewEmail avec oobCode:", oobCode);
        try {
          const auth = getAuth();
          console.log("Tentative d'appliquer le code d'action");
          await applyActionCode(auth, oobCode);
          console.log("Code d'action appliqué avec succès");

          const user = auth.currentUser;
          console.log("Utilisateur actuel:", user);

          if (user) {
            console.log("Rechargement de l'utilisateur");
            await user.reload();
            console.log("Utilisateur rechargé:", user);

            const state = getState() as RootState;
            const pendingNewEmail = selectPendingNewEmail(state);

            const updatedUser: AppUser = {
              uid: user.uid,
              email: user.email || "",
              username: user.displayName || user.email?.split("@")[0] || null,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              isAuthenticated: true,
            };
            console.log("Utilisateur mis à jour:", updatedUser);

            return {
              data: {
                success: true,
                user: updatedUser,
                newEmail: user.email,
              },
            };
          }
          return { data: { success: false, user: null, newEmail: null } };
        } catch (error: unknown) {
          console.error("Erreur dans la mutation verifyNewEmail:", error);
          if (error instanceof Error) {
            return { error: { status: "CUSTOM_ERROR", error: error.message } };
          } else {
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: "Une erreur inconnue s'est produite",
              },
            };
          }
        }
      },
    }),
  }),
});

export const {
  useAddContactMutation,
  useCheckUsernameUniquenessMutation,
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
  useUpdateEmailMutation,
  useUpdateusernameMutation,
  useUpdatePasswordMutation,
  useUpdateProfilePictureMutation,
  useVerifyEmailMutation,
  useVerifyNewEmailMutation,
  useVerifyBeforeUpdateEmailMutation,
} = api;
