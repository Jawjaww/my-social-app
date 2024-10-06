import {
  confirmPasswordReset,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  verifyBeforeUpdateEmail,
  sendPasswordResetEmail,
  checkActionCode,
  applyActionCode,
  updateEmail,
} from "firebase/auth";
import {
  ref,
  set,
  get,
  update,
  query,
  orderByChild,
  equalTo,
  child,
  remove,
} from "firebase/database";
import { FirebaseError } from "firebase/app";
import { auth, realtimeDb } from "./firebaseConfig";
import type { IMessage } from 'react-native-gifted-chat';
import {
  Activity,
  Contact,
  User,
  AppUser,
  ProfileUser,
  Contacts,
} from "../types/sharedTypes";
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@env";


export type AppError = FetchBaseQueryError | SerializedError;
type DeleteContactResult = { success: true } | { success: false, error: string };

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    addContact: builder.mutation<Contact, { uid: string; contactUid: string }>({
      queryFn: async ({ uid, contactUid }) => {
        try {
          const contactRef = ref(realtimeDb, `contacts/${uid}/contactsList/${contactUid}`);
          const userProfileRef = ref(realtimeDb, `userProfiles/${contactUid}`);
          
          const [contactSnapshot, userProfileSnapshot] = await Promise.all([
            get(contactRef),
            get(userProfileRef)
          ]);

          if (!userProfileSnapshot.exists()) {
            throw new Error("User profile not found");
          }

          const userProfileData = userProfileSnapshot.val();
          const newContact: Contact = {
            contactUid,
            contactUsername: userProfileData.username,
            contactAvatarUri: userProfileData.avatarUri || null,
            contactAvatarUrl: userProfileData.avatarUrl || null,
            lastInteraction: Date.now(),
            bio: userProfileData.bio || '',
          };

          await set(contactRef, newContact);
          return { data: newContact };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),

    applyEmailVerificationCode: builder.mutation<
      { success: boolean; user: AppUser | null; newEmail: string | null },
      string
    >({
      queryFn: async (oobCode) => {
        console.log(
          "Début de applyEmailVerificationCode avec oobCode:",
          oobCode
        );
        try {
          const auth = getAuth();
          const checkResult = await checkActionCode(auth, oobCode);
          const newEmail = checkResult.data.email;

          console.log("Résultat de checkActionCode:", checkResult);
          console.log("Nouvel email obtenu:", newEmail);

          if (!newEmail) {
            console.log("Nouvel email non trouvé dans le code d'action");
            throw new Error("Nouvel email non trouvé dans le code d'action");
          }

          await applyActionCode(auth, oobCode);
          console.log("Code d'action appliqué avec succès");

          const user = auth.currentUser;
          console.log("Utilisateur actuel:", user);

          if (user) {
            // Update the user's email
            await updateEmail(user, newEmail);
            console.log("Email mis à jour avec succès:", newEmail);

            // Reload the user to get the latest information
            await user.reload();
            console.log("Utilisateur rechargé:", user);

            const updatedUser: AppUser = {
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified,
              isAuthenticated: true,
            };
            console.log("Utilisateur mis à jour:", updatedUser);
            return {
              data: { success: true, user: updatedUser, newEmail: user.email },
            };
          }
          console.log("Aucun utilisateur trouvé");
          return { data: { success: true, user: null, newEmail: null } };
        } catch (error: unknown) {
          console.error(
            "Erreur dans la mutation applyEmailVerificationCode:",
            error
          );
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
    checkUsernameAvailability: builder.mutation<{ available: boolean }, string>(
      {
        queryFn: async (username) => {
          try {
            const usernameRef = ref(realtimeDb, `usernames/${username}`);
            const snapshot = await get(usernameRef);
            return { data: { available: !snapshot.exists() } };
          } catch (error) {
            console.error("Error checking username availability:", error);
            return { error: { status: 500, data: (error as Error).message } };
          }
        },
      }
    ),
    // Used in SignUp mutation to create a new user profile in the database
    createProfileUser: builder.mutation<ProfileUser, Partial<ProfileUser>>({
      queryFn: async (profileUser) => {
        try {
          const userProfileRef = ref(realtimeDb, `userProfiles/${profileUser.uid}`);
          const newProfile = {
            ...profileUser,
            isSignUpComplete: false, // Need username to be set to true
          };
          await set(userProfileRef, newProfile);
          return { data: newProfile as ProfileUser };
        } catch (error) {
          console.error("Error creating user profile:", error);
          return { error: { status: 500, data: (error as Error).message } };
        }
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
    deleteContact: builder.mutation<string, { userUid: string; contactUid: string }>({
      async queryFn({ userUid, contactUid }) {
        try {
          const contactRef = ref(realtimeDb, `contacts/${userUid}/contactsList/${contactUid}`);
          await remove(contactRef);
          return { data: contactUid };
        } catch (error) {
          return { 
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'An unknown error occurred',
            } as FetchBaseQueryError
          };
        }
      },
    }),
    deleteMessage: builder.mutation<void, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
    }),
    downloadAvatar: builder.mutation<string, { avatarUrl: string }>({
      queryFn: async ({ avatarUrl }) => {
        try {
          // Here, we simply return the URL because React Native handles display via URI
          return { data: avatarUrl };
        } catch (error: any) {
          console.error("Error downloading avatar:", error);
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to download avatar",
            },
          };
        }
      },
    }),
    getContactActivities: builder.query<Activity[], void>({
      query: () => "contactActivities",
    }),
    getContactSuggestions: builder.query<Contacts[], void>({
      query: () => "contactSuggestions",
    }),
    getContacts: builder.query<{ [key: string]: Contact }, string>({
      async queryFn(uid) {
        try {
          const dbRef = ref(realtimeDb);
          const snapshot = await get(child(dbRef, `contacts/${uid}/contactsList`));
          if (snapshot.exists()) {
            const contactsData = snapshot.val();
            const contacts: { [key: string]: Contact } = {};

            for (const contactUid of Object.keys(contactsData)) {
              const contactInfo = contactsData[contactUid];
              const userRef = ref(realtimeDb, `userProfiles/${contactUid}`);
              const userSnapshot = await get(userRef);
              const userData = userSnapshot.val();

              if (userData) {
                contacts[contactUid] = {
                  contactUid,
                  contactUsername: userData.username || '',
                  contactAvatarUrl: userData.avatarUrl || null,
                  contactAvatarUri: userData.avatarUri || null,
                  lastInteraction: contactInfo.lastInteraction || Date.now(),
                  bio: userData.bio || '',
                };
              }
            }

            return { data: contacts };
          } else {
            return { data: {} };
          }
        } catch (error) {
          console.error('Error fetching contacts:', error);
          return { 
            error: { 
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'An unknown error occurred'
            } 
          };
        }
      },
    }),
    
    getDiscoverUsers: builder.query<User[], void>({
      query: () => "discoverUsers",
    }),
    getMessages: builder.query<IMessage[], string>({
      query: (userId) => `messages/${userId}`,
    }),
    
    getRecentChats: builder.query<Contacts[], void>({
      query: () => "recentChats",
    }),
    getUidByUsername: builder.query<{ exists: boolean; uid?: string }, string>({
      queryFn: async (username) => {
        try {
          const userQuery = query(ref(realtimeDb, 'userProfiles'), orderByChild('username'), equalTo(username));
          const snapshot = await get(userQuery);
          if (snapshot.exists()) {
            const data = snapshot.val();
            const uid = Object.keys(data)[0];
            return { data: { exists: true, uid } };
          } else {
            return { data: { exists: false } };
          }
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } as FetchBaseQueryError };
        }
      },
    }), 
    getUnreadMessagesCount: builder.query<number, void>({
      query: () => "unreadMessagesCount",
    }),
    getUserProfile: builder.query<ProfileUser, string>({
      queryFn: async (uid) => {
        try {
          const userRef = ref(realtimeDb, `userProfiles/${uid}`);
    
          const userSnapshot = await get(userRef);
    
          if (!userSnapshot.exists()) {
            return { error: { status: 'CUSTOM_ERROR', error: 'User profile not found' } };
          }
    
          const userData = userSnapshot.val() || {};
    
          const profile: ProfileUser = {
            uid,
            username: userData.username || null,
            avatarUri: userData.avatarUri || null,
            avatarUrl: userData.avatarUrl || null,
            bio: userData.bio || null,
            isSignUpComplete: userData.isSignUpComplete || false,
          };
    
          return { data: profile };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: (error as Error).message } };
        }
      },
    }),
    reauthenticateAndUpdateEmail: builder.mutation<
      { success: boolean; emailSent: boolean },
      { newEmail: string; password: string }
    >({
      queryFn: async ({ newEmail, password }) => {
        console.log("reauthenticateAndUpdateEmail called with:", {
          newEmail,
          password: "***",
        });
        try {
          const user = auth.currentUser;
          if (!user || !user.email) {
            console.error("No authenticated user or user email is missing");
            throw new Error("No authenticated user or user email is missing");
          }

          console.log("Reauthenticating user");
          const credential = EmailAuthProvider.credential(user.email, password);
          await reauthenticateWithCredential(user, credential);
          console.log("User reauthenticated successfully");

          console.log("Sending verification email to new address");
          await verifyBeforeUpdateEmail(user, newEmail);
          console.log("Verification email sent successfully");

          return { data: { success: true, emailSent: true } };
        } catch (error) {
          console.error("Error in reauthenticateAndUpdateEmail:", error);
          if (error instanceof FirebaseError) {
            if (error.code === "auth/email-already-in-use") {
              return {
                error: {
                  status: "CUSTOM_ERROR",
                  error: "This email is already in use",
                  emailSent: false,
                },
              };
            }
          }
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred",
              emailSent: false,
            },
          };
        }
      },
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
        } catch (error) {
          throw error;
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
          const userRef = ref(realtimeDb, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          const userData = snapshot.val();
          const appUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            emailVerified: firebaseUser.emailVerified,
            isAuthenticated: true,
          };
          return { data: appUser };
        } catch (error) {
          throw error;
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
          throw error;
        }
      },
    }),
    signUp: builder.mutation<
      { appUser: AppUser; profileUser: ProfileUser },
      { email: string; password: string }
    >({
      async queryFn({ email, password }, { dispatch, getState }) {
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
            emailVerified: firebaseUser.emailVerified,
            isAuthenticated: true,
          };

          const profileUser: ProfileUser = {
            uid: firebaseUser.uid,
            username: null,
            avatarUri: null,
            bio: null,
            isSignUpComplete: false,
          };

          console.log("Creating profile user:", profileUser);

          await dispatch(
            api.endpoints.createProfileUser.initiate(profileUser)
          ).unwrap();

          console.log("Profile user created successfully");

          return { data: { appUser, profileUser } };
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
    updateAvatarUri: builder.mutation<
      string | null,
      { userId: string; avatarUri: string | null }
    >({
      queryFn: async ({ userId, avatarUri }) => {
        try {
          console.log("Updating avatar URI in Firebase:", {
            userId,
            avatarUri,
          });
          const userRef = ref(realtimeDb, `userProfiles/${userId}`);
          await update(userRef, { avatarUri: avatarUri });
          console.log("Avatar URI updated successfully:", avatarUri);
          return { data: avatarUri };
        } catch (error: any) {
          console.error("Error updating avatar URI:", error);
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "An unknown error occurred",
            },
          };
        }
      },
    }),
    updateAvatarUrl: builder.mutation<
      string | null,
      { userId: string; avatarUrl: string | null }
    >({
      queryFn: async ({ userId, avatarUrl }) => {
        try {
          console.log("Updating avatar URL in Firebase:", {
            userId,
            avatarUrl,
          });
          const userRef = ref(realtimeDb, `userProfiles/${userId}`);
          await update(userRef, { avatarUrl: avatarUrl });
          console.log("Avatar URL updated successfully:", avatarUrl);
          return { data: avatarUrl };
        } catch (error: any) {
          console.error("Error updating avatar URL:", error);
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "An unknown error occurred",
            },
          };
        }
      },
    }),
    updateContactNotificationToken: builder.mutation<void, { contactUid: string; token: string }>({
      query: ({ contactUid, token }) => ({
        url: `contacts/${contactUid}/notificationToken`,
        method: 'PUT',
        body: { token },
      }),
    }),
    updateUsername: builder.mutation<
      ProfileUser,
      { uid: string; username: string }
    >({
      queryFn: async ({ uid, username }) => {
        try {
          const userProfileRef = ref(realtimeDb, `userProfiles/${uid}`);

          // Get the current profile
          const currentProfileSnapshot = await get(userProfileRef);
          const currentProfile = currentProfileSnapshot.val() as ProfileUser;

          if (!currentProfile) {
            throw new Error("User profile not found");
          }

          // Check if the new username is already taken
          const usernameQuery = query(
            ref(realtimeDb, "userProfiles"),
            orderByChild("username"),
            equalTo(username)
          );
          const usernameSnapshot = await get(usernameQuery);

          if (usernameSnapshot.exists()) {
            throw new Error("Username is already taken");
          }

          // Update the username in the user profile
          await update(userProfileRef, { username, isSignUpComplete: true });

          // Get the updated profile
          const updatedProfileSnapshot = await get(userProfileRef);
          const updatedProfile = updatedProfileSnapshot.val() as ProfileUser;

          return { data: updatedProfile };
        } catch (error) {
          console.error("Error updating username:", error);
          return { error: { status: 500, data: (error as Error).message } };
        }
      },
    }),
    updateUserNotificationToken: builder.mutation<void, { uid: string; token: string }>({
      query: ({ uid, token }) => ({
        url: `users/${uid}/notificationToken`,
        method: 'PUT',
        body: { token },
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
    updateProfile: builder.mutation<ProfileUser, string>({
      queryFn: async (uid) => {
        try {
          const userRef = ref(realtimeDb, `userProfiles/${uid}`);
          const userSnapshot = await get(userRef);

          if (!userSnapshot.exists()) {
            throw new Error("User profile not found");
          }

          const userData = userSnapshot.val() || {};

          const profile: ProfileUser = {
            uid,
            username: userData.username || null,
            avatarUri: userData.avatarUri || null,
            avatarUrl: userData.avatarUrl || null,
            bio: userData.bio || null,
            isSignUpComplete: userData.isSignUpComplete || false,
          };

          console.log("Profile fetched from Firebase:", profile);

          return { data: profile };
        } catch (error) {
          console.error("Error fetching user profile:", error);
          return { error: { status: 500, data: (error as Error).message } };
        }
      },
    }),
    uploadAvatar: builder.mutation<string, { imageUri: string; uid: string }>({
      async queryFn({ imageUri, uid }) {
        try {
          const formData = new FormData();
          formData.append("file", {
            uri: imageUri.startsWith("file://")
              ? imageUri
              : "file://" + imageUri,
            type: "image/jpeg",
            name: "avatar.jpg",
          } as any);
          formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
          formData.append("public_id", `avatars/${uid}/avatar`);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const result = await response.json();

          if (response.ok && result.secure_url) {
            return { data: result.secure_url };
          } else {
            console.error("Cloudinary upload error:", result);
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: result.error?.message || "Upload failed",
              },
            };
          }
        } catch (error: any) {
          console.error("Network or other error:", error);
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "An unknown error occurred",
            },
          };
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
    getContactProfile: builder.query<Contact, string>({
      async queryFn(contactUid) {
        try {
          const userRef = ref(realtimeDb, `userProfiles/${contactUid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            return {
              data: {
                contactUid,
                contactUsername: data.username || '',
                contactAvatarUrl: data.avatarUrl || null,
                contactAvatarUri: data.avatarUri || null,
                lastInteraction: data.lastInteraction || Date.now(),
                bio: data.bio || '',
                notificationToken: data.notificationToken || null, // Inclusion du notificationToken
              },
            };
          } else {
            return { error: { status: 404, data: 'Contact profile not found' } };
          }
        } catch (error) {
          return { 
            error: { 
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'An unknown error occurred'
            } 
          };
        }
      },
    }),
  }),
});

export const {
  useAddContactMutation,
  useApplyEmailVerificationCodeMutation,
  useCheckUsernameAvailabilityMutation,
  // useCreateProfileUserMutation,
  useDeleteAccountMutation,
  useDeleteContactMutation,
  useDeleteMessageMutation,
  useDownloadAvatarMutation,
  useGetContactActivitiesQuery,
  useGetContactProfileQuery,
  useGetContactSuggestionsQuery,
  useGetContactsQuery,
  useGetDiscoverUsersQuery,
  useGetMessagesQuery,
  // useGetProfileUserQuery,
  useGetRecentChatsQuery,
  useGetUidByUsernameQuery,
  useGetUnreadMessagesCountQuery,
  useGetUserProfileQuery,
  useRemoveContactMutation,
  useResetPasswordMutation,
  useSendMessageMutation,
  useSendPasswordResetEmailMutation,
  useSendVerificationEmailMutation,
  useSignInMutation,
  useSignInWithGoogleMutation,
  useSignOutMutation,
  useSignUpMutation,
  useUpdateAvatarUriMutation,
  useUpdateAvatarUrlMutation,
  useUpdateContactNotificationTokenMutation,
  useUpdateUsernameMutation,
  useUpdateUserNotificationTokenMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useReauthenticateAndUpdateEmailMutation,
  useVerifyEmailMutation,
} = api;