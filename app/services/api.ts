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
  updateProfile,
  checkActionCode,
  applyActionCode,
  updateEmail,
} from "firebase/auth";
import { ref, set, get, update, query, orderByChild, equalTo } from "firebase/database";
import { FirebaseError } from "firebase/app";
import { auth, realtimeDb, storage } from "./firebaseConfig";
import { IMessage } from "react-native-gifted-chat";
import {
  Activity,
  Contact,
  User,
  AppUser,
  ProfileUser,
} from "../types/sharedTypes";
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit";


export type AppError = FetchBaseQueryError | SerializedError;

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

          const usernameRef = ref(realtimeDb, `usernames/${username}`);
          const snapshot = await get(usernameRef);

          if (!snapshot.exists()) {
            throw new Error("User not found");
          }

          const contactUid = snapshot.val();
          const contactRef = ref(
            realtimeDb,
            `contacts/${currentUser.uid}/${contactUid}`
          );
          await set(contactRef, true);

          return { data: undefined };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
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
    createProfileUser: builder.mutation<ProfileUser, ProfileUser>({
      queryFn: async (profileUser) => {
        try {
          const userProfileRef = ref(realtimeDb, `userProfiles/${profileUser.uid}`);
          await set(userProfileRef, profileUser);
          return { data: profileUser };
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
    getProfile: builder.mutation<ProfileUser, string>({
      queryFn: async (uid) => {
        try {
          const userProfileRef = ref(realtimeDb, `userProfiles/${uid}`);
          const userRef = ref(realtimeDb, `users/${uid}`);
          
          const [userProfileSnapshot, userSnapshot] = await Promise.all([
            get(userProfileRef),
            get(userRef)
          ]);
    
          if (!userProfileSnapshot.exists() && !userSnapshot.exists()) {
            throw new Error("User profile not found");
          }
    
          const userProfileData = userProfileSnapshot.val() || {};
          const userData = userSnapshot.val() || {};
    
          const profile: ProfileUser = {
            uid,
            username: userProfileData.username || null,
            avatarUri: userData.avatarUri || null,
            bio: userProfileData.bio || null,
          };
    
          console.log("Profile fetched from Firebase:", profile);
    
          return { data: profile };
        } catch (error) {
          console.error("Error fetching user profile:", error);
          return { error: { status: 500, data: (error as Error).message } };
        }
      },
    }),
    getRecentChats: builder.query<Contact[], void>({
      query: () => "recentChats",
    }),
    getUnreadMessagesCount: builder.query<number, void>({
      query: () => "unreadMessagesCount",
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
    updateAvatarUri: builder.mutation<string | null, { userId: string; avatarUri: string | null }>({
      queryFn: async ({ userId, avatarUri }) => {
        try {
          console.log("Updating avatar URI in Firebase:", { userId, avatarUri });
          const userRef = ref(realtimeDb, `users/${userId}`);
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

    updateUsername: builder.mutation<ProfileUser, { uid: string; username: string }>({
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
          const usernameQuery = query(ref(realtimeDb, 'userProfiles'), orderByChild('username'), equalTo(username));
          const usernameSnapshot = await get(usernameQuery);
    
          if (usernameSnapshot.exists()) {
            throw new Error("Username is already taken");
          }
    
          // Update the username in the user profile
          await update(userProfileRef, { username });
    
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
    updateUserProfile: builder.mutation<
      ProfileUser,
      Partial<ProfileUser> & { uid: string }
    >({
      queryFn: async (updatedProfile) => {
        try {
          const { uid, ...profileData } = updatedProfile;
          const userRef = ref(realtimeDb, `users/${uid}`);
          await update(userRef, profileData);

          const updatedProfileUser: ProfileUser = {
            uid,
            username: profileData.username ?? null,
            avatarUri: profileData.avatarUri ?? null,
            bio: profileData.bio ?? null,
          };

          return { data: updatedProfileUser };
        } catch (error) {
          console.error("Error updating user profile:", error);
          return { error: { status: 500, data: (error as Error).message } };
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
  }),
});

export const {
  useAddContactMutation,
  useApplyEmailVerificationCodeMutation,
  useCheckUsernameAvailabilityMutation,
  // useCreateProfileUserMutation,
  useDeleteAccountMutation,
  useDeleteMessageMutation,
  useGetContactActivitiesQuery,
  useGetContactSuggestionsQuery,
  useGetContactsQuery,
  useGetDiscoverUsersQuery,
  useGetMessagesQuery,
  useGetProfileMutation,
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
  useUpdateAvatarUriMutation,
  useUpdateUsernameMutation,
  useUpdatePasswordMutation,
  useUpdateUserProfileMutation,
  useReauthenticateAndUpdateEmailMutation,
  useVerifyEmailMutation,
} = api;
