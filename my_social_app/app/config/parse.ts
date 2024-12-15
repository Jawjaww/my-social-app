import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PARSE_APP_ID, PARSE_SERVER_URL } from '@env';

export const initializeParse = () => {
  try {
    console.log(' Initializing Parse...');
    Parse.setAsyncStorage(AsyncStorage);
    Parse.initialize(PARSE_APP_ID);
    Parse.serverURL = PARSE_SERVER_URL;
    console.log(' Parse initialized successfully');
  } catch (error) {
    console.error(' Parse initialization error:', error);
    throw error;
  }
};

// Export les fonctions d'authentification et autres
export const ParseService = {
  signIn: async (username: string, password: string) => {
    try {
      const user = await Parse.User.logIn(username, password);
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  signOut: async () => {
    try {
      await Parse.User.logOut();
    } catch (error) {
      throw error;
    }
  },
  
  getCurrentUser: () => {
    return Parse.User.current();
  },
  
  updateFCMToken: async (token: string) => {
    try {
      const user = Parse.User.current();
      if (user) {
        user.set('fcmToken', token);
        await user.save();
      }
    } catch (error) {
      throw error;
    }
  },

  signUp: async (username: string, email: string, password: string) => {
    try {
      const user = new Parse.User();
      user.set('username', username);
      user.set('email', email);
      user.set('password', password);
      const result = await user.signUp();
      return result;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      await Parse.User.requestPasswordReset(email);
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (fields: { [key: string]: any }) => {
    try {
      const user = Parse.User.current();
      if (!user) throw new Error('No user is currently logged in');

      Object.entries(fields).forEach(([key, value]) => {
        user.set(key, value);
      });

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }
};
