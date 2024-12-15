import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit";
import Parse from 'parse/react-native';
import {
  Activity,
  Contact,
  AppUser,
  ProfileUser,
  Contacts,
} from "../types/sharedTypes";
import Constants from 'expo-constants';

export interface AppError {
  status: string | number;
  data: {
    message: string;
  };
}

// Helper to transform Parse errors into RTK Query errors
const transformError = (error: any): FetchBaseQueryError => ({
  status: error.code || 'PARSE_ERROR',
  data: { message: error.message || 'An error occurred' }
});

export const api = createApi({
  reducerPath: "api",
  tagTypes: ['Profile', 'Contacts', 'Messages', 'Activities'] as const,
  baseQuery: fetchBaseQuery({ 
    baseUrl: Constants.expoConfig?.extra?.parseApiUrl || 'http://localhost:1337/parse',
    prepareHeaders: (headers) => {
      headers.set('X-Parse-Application-Id', Constants.expoConfig?.extra?.parseApplicationId || '');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation<{ appUser: AppUser }, { email: string; password: string }>({
      async queryFn(credentials) {
        try {
          const user = new Parse.User();
          user.set('username', credentials.email);
          user.set('email', credentials.email);
          user.set('password', credentials.password);
          
          const result = await user.signUp();
          
          const appUser: AppUser = {
            uid: result.id,
            email: result.get('email'),
            emailVerified: result.get('emailVerified') || false,
            isAuthenticated: true,
          };
          
          return { data: { appUser } };
        } catch (error) {
          return { error: transformError(error) };
        }
      },
    }),

    signIn: builder.mutation<{ isAuthenticated: boolean; user: AppUser }, { email: string; password: string }>({
      async queryFn(credentials) {
        try {
          const user = await Parse.User.logIn(credentials.email, credentials.password);
          
          const appUser: AppUser = {
            uid: user.id,
            email: user.get('email'),
            emailVerified: user.get('emailVerified') || false,
            isAuthenticated: true,
          };
          
          return { data: { isAuthenticated: true, user: appUser } };
        } catch (error) {
          return { error: transformError(error) };
        }
      },
    }),

    signOut: builder.mutation<void, void>({
      async queryFn() {
        try {
          await Parse.User.logOut();
          return { data: undefined };
        } catch (error) {
          return { error: transformError(error) };
        }
      },
    }),

    verifyEmail: builder.mutation<void, void>({
      async queryFn() {
        try {
          const user = Parse.User.current();
          if (!user) throw new Error('No user is logged in');
          
          await Parse.Cloud.run('sendVerificationEmail');
          return { data: undefined };
        } catch (error) {
          return { error: transformError(error) };
        }
      },
    }),

    resetPassword: builder.mutation<void, { token: string; newPassword: string }>({
      async queryFn({ token, newPassword }) {
        try {
          await Parse.Cloud.run('resetPassword', { token, newPassword });
          return { data: undefined };
        } catch (error) {
          return { error: transformError(error) };
        }
      },
    }),

    sendPasswordResetEmail: builder.mutation<void, string>({
      async queryFn(email) {
        try {
          await Parse.User.requestPasswordReset(email);
          return { data: undefined };
        } catch (error) {
          return { error: transformError(error) };
        }
      },
    }),

    addContact: builder.mutation<Contact, { uid: string; contactUid: string }>({
      async queryFn({ uid, contactUid }) {
        try {
          const contact = await Parse.Cloud.run('addContact', { uid, contactUid });
          const contactData: Contact = {
            contactUid: contact.contact,
            contactUsername: contact.username,
            contactAvatarUrl: contact.avatarUrl || null,
            lastInteraction: Date.now(),
          };
          return { data: contactData };
        } catch (error) {
          return { error: transformError(error) };
        }
      },
      invalidatesTags: ['Contacts'],
    }),

    removeContact: builder.mutation<string, { userUid: string; contactUid: string }>({
      async queryFn({ userUid, contactUid }) {
        try {
          await Parse.Cloud.run('removeContact', { userUid, contactUid });
          return { data: contactUid };
        } catch (error) {
          return { error: transformError(error) };
        }
      },
      invalidatesTags: ['Contacts'],
    }),

    getContacts: builder.query<{ [key: string]: Contact }, string>({
      async queryFn(uid) {
        try {
          const contacts = await Parse.Cloud.run('getContacts', { uid });
          const contactsMap: { [key: string]: Contact } = {};
          
          Object.entries(contacts).forEach(([key, value]: [string, any]) => {
            contactsMap[key] = {
              contactUid: value.contactUid,
              contactUsername: value.username,
              contactAvatarUrl: value.avatarUrl || null,
              lastInteraction: value.lastInteraction || Date.now(),
            };
          });
          
          return { data: contactsMap };
        } catch (error) {
          return { error: transformError(error) };
        }
      },
      providesTags: ['Contacts'],
    }),

    getContactInfo: builder.query<Contact, string>({
      async queryFn(contactUid) {
        try {
          const contact = await Parse.Cloud.run('getContactInfo', { contactUid });
          const contactData: Contact = {
            contactUid: contact.id,
            contactUsername: contact.username,
            contactAvatarUrl: contact.avatarUrl || null,
            lastInteraction: Date.now(),
          };
          return { data: contactData };
        } catch (error) {
          return { error: transformError(error) };
        }
      },
    }),

    getProfile: builder.query<ProfileUser, string>({
      async queryFn(uid) {
        try {
          const profile = await Parse.Cloud.run('getProfile', { uid });
          const profileData: ProfileUser = {
            uid: profile.id,
            username: profile.username,
            avatarUrl: profile.avatarUrl || null,
            isSignUpComplete: profile.isSignUpComplete || false,
          };
          return { data: profileData };
        } catch (error) {
          return { error: transformError(error) };
        }
      },
      providesTags: ['Profile'],
    }),
  }),
});

export const {
  useAddContactMutation,
  useGetContactInfoQuery,
  useGetContactsQuery,
  useGetProfileQuery,
  useRemoveContactMutation,
  useResetPasswordMutation,
  useSendPasswordResetEmailMutation,
  useSignInMutation,
  useSignOutMutation,
  useSignUpMutation,
  useVerifyEmailMutation,
} = api;