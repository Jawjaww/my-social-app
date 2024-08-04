import React, { useEffect } from 'react';
import './env.d.ts';
import { View, ActivityIndicator } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import RootStack from './app/navigation/RootStack';
import { enableScreens } from 'react-native-screens';
import { onAuthStateChanged } from 'firebase/auth';
import { app, auth, db } from './app/services/firebaseConfig';
import { SENTRY_DSN } from '@env';
import 'intl-pluralrules'; 
import { I18nextProvider } from 'react-i18next'; 
import i18n from './app/i18n/i18n';
import { Linking } from 'react-native';
import useDeepLinking from './app/hooks/useDeepLinking';
import store, { RootState } from './app/store';
import { setUser, setLoading } from './app/features/authentication/authSlice';
import { useSignInMutation, useSignUpMutation, useSignOutMutation } from './app/services/api';
import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './app/navigation/navigationTypes';
import { AppUser } from './app/features/authentication/authTypes';

enableScreens();

Sentry.init({
  dsn: SENTRY_DSN,
  debug: true, // Set to false in production
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppContent />
      </I18nextProvider>
    </Provider>
  );
};

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          isAuthenticated: true,
        };
        dispatch(setUser(appUser));
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });
  
    return () => unsubscribe();
  }, [dispatch]);

  const linking = {
    prefixes: ['https://mysocialapp.com', 'mysocialapp://'],
    config: {
      screens: {
        Auth: {
          screens: {
            ResetPassword: 'resetPassword/:oobCode',
            VerifyEmail: 'verifyEmail/:oobCode',
          },
        },
        Main: {
          screens: {
            Home: 'home',
            Profile: 'profile',
            Message: 'message',
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking as any}>
      <RootStack />
    </NavigationContainer>
  );
};

export default App;